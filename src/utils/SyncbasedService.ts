import crypto from 'crypto';

interface SyncBasedServiceTable {[key: string]: {
    table: any,
    editableFields: string[]
    relationIncludes?: string[]
}}


export enum SyncAction {
    UPDATE='UPDATE',
    INSERT='INSERT',
    DELETE='DELETE'
} 

export interface FieldToSync {
    field_name: string,
    value: any,
    date: Date
}
export interface RecordToSync {
    id: string | undefined,
    fields: FieldToSync[],
    action: SyncAction
}
export interface DataToSync {
    [key: string]: RecordToSync[];
}


export default class SyncBasedService {

    tables: SyncBasedServiceTable = {};
    tablesOrderedForRelationResolution:string[] = [];

    constructor(_tables:SyncBasedServiceTable, _tablesOrderedForRelationResolution:string[]) {
        this.tables = _tables;
        this.tablesOrderedForRelationResolution = _tablesOrderedForRelationResolution;
    }

    /**
     * Mounts the SELECT query to the data PULL based on the last sync date
     * Does not distinguish table
     */
    async getPullQuery(lastSync?:Date, filters:any = {}) {
        const tableNames = Object.keys(this.tables);
        const dbActionsFirstItemFinder:Function[] = [];
        const daysToAdd = 120;
        const oneDayInMs = 24 * 60 * 60 * 1000; // 86,400,000 milliseconds

        // The maximum date where data will be gathered
        // Important to limit requests when there is too much data to avoid a single user locking the server
        let maxSyncDate:Date|undefined = undefined;
        let query:any = {};

        // LastSync was not provided, meaning it's the first pull the user is making
        if (!lastSync) {

            // 1. For each table in the service
            await tableNames.forEach(async tableName => {
                // 1.1 Prepare a query to get the first item of the table
                const table = this.tables[tableName].table;
                dbActionsFirstItemFinder.push(() => {
                    return table.findFirst({
                        orderBy: { updatedAt: 'asc' },
                    });
                })
            })

            // 2. Execute the queries. Expect 1 item per table
            let results = await Promise.all(dbActionsFirstItemFinder.map(task => task()));
            results = results.filter(result => {
                if (!result) return false;

                // 2.1 Get one day before the first record of the table
                let newLastSyncCandidate = new Date(result.updatedAt.getTime() - oneDayInMs);
                if (!lastSync || newLastSyncCandidate < lastSync) {
                    lastSync = newLastSyncCandidate
                } 

                return true;
            })

            // 3. Check for the possibility of all the tables being EMPTY.
            if (results.length == 0) {
                return {
                    query: null,
                    maxSyncDate: null
                }
            }
        }

        maxSyncDate = new Date(lastSync!.getTime() + daysToAdd * oneDayInMs);
        query = {
            where: { updatedAt: { gt: lastSync, lte: maxSyncDate }, ...filters },
            orderBy: { updatedAt: 'asc' },
        }

        return {
            query,
            maxSyncDate,
        }
    }

    /**
     * Pull all the unsynced data from the service (all tables from that service) to the client based on a provided last sync date 
     */
    async getAllUnsyced(_lastSync?:Date, filters:any = {}) {
        const tableNames = Object.keys(this.tables);
        const syncStartedAt = new Date();
        const {query, maxSyncDate} = await this.getPullQuery(_lastSync, filters);
        
        // 1. The query being empty means that none of the tables in the service have any data. We send the result empty informing that at this sync time there is no data without further DB queries
        if (query == null) {
            console.devlog('Trying to pull data from service, but all the tables are empty');
            let tablesEmptyResult:{[key:string]: any} = {
                syncTime: syncStartedAt,
                loadMore: false,
            }
            tableNames.forEach(tableName => {
                tablesEmptyResult[tableName] = [];
            })

            return tablesEmptyResult;
        }

        const dbActionsFinalQuery:Function[] = [];

        // 2. For each table in the service
        tableNames.forEach(tableName => {
            // 2.1 Prepare a pull query for the table
            const table = this.tables[tableName].table;
            dbActionsFinalQuery.push(() => {
                const shouldInclude:{[key:string]: boolean} = {}
                this.tables[tableName].relationIncludes?.forEach(shouldIncludeName => {
                    shouldInclude[shouldIncludeName] = true
                })
                return table.findMany({...query, include: shouldInclude});
            })
        })

        let shouldLoadMore = false;
        let syncTime = syncStartedAt;

        // 3. If the query was limited to items before the current time, it means that there's more data to be synced. Which will be done in the next requests
        if (maxSyncDate && maxSyncDate < syncStartedAt) {
            shouldLoadMore = true;
            syncTime = maxSyncDate;
        }

        const finalResult:{[key:string]: any} = {
            syncTime: syncTime,
            loadMore: shouldLoadMore
        };
        
        // 4. Execute all queries 
        const results = await Promise.all(dbActionsFinalQuery.map(task => task()));
        results.forEach((result, index) => {
            finalResult[tableNames[index]] = result;
        });

        return finalResult;
    }


    async pushToSync(dataToSync:DataToSync) {
        const syncStartedAt = new Date();
        const dbActions:{[table:string]: Function[]} = {};
        const relationResolutionTable:{[key: string]: string} = {}

        Object.keys(dataToSync).forEach(tableName => {
            // Initialize dbActions list for that table
            dbActions[tableName] = [];

            const table = this.tables[tableName].table;
            const editableFields = this.tables[tableName].editableFields;
            if (!table) {
                console.devlog('TRYING TO PUSH SYNC - TABLE DOES NOT EXIST', table);
                return;
            }
            const records = dataToSync[tableName];


            records.forEach(record => {
                const fieldsFlattened:{[key:string]:any} = {};
                const fieldsUpdateDates:{[key:string]:Date} = {};

                // When an ID is wrapped around <<<and>>> it means it is a temporary id created in the client side. The server must now create a new ID for these items and resolve relations
                if (record.id && (record.id.startsWith('<<<') && record.id.endsWith('>>>'))) {

                    // Try to find the id in the relation resolution table
                    let newId = relationResolutionTable[record.id];
                    if (!newId) {
                        // The id wasn't created yet, so must be created now
                        newId = crypto.randomUUID();
                    }

                    fieldsFlattened['id'] = newId;
                    relationResolutionTable[record.id] = newId;
                }

                record.fields.forEach(field => {
                    // Any field finishing with "Id", such as "userId", "examId", "questionId" is considered a relational field
                    let isRelationalField = field.field_name.endsWith('Id');

                    // If the relational field is temporary (wrapped in <<<and>>>)
                    if (isRelationalField && field.value.startsWith('<<<') && field.value.endsWith('>>>')) {
                        let tempId = field.value;
                        // Try to find the id in the relation resolution table
                        let newId = relationResolutionTable[tempId];
                        if (!newId) {
                            // The id wasn't created yet, so must be created now
                            newId = crypto.randomUUID();
                            relationResolutionTable[tempId] = newId
                        }
                        field.value = newId;
                    }

                    if (editableFields.indexOf(field.field_name) === -1) {
                        console.devlog('TRYING TO PUSH SYNC - FIELD DOES NOT EXIST OR NOT AUTHORIZED FOR TABLE', table+":", field.field_name);
                        return;
                    }

                    fieldsFlattened[field.field_name] = field.value;
                    fieldsUpdateDates[field.field_name] = field.date;
                })


                // INSERT
                if (record.action == SyncAction.INSERT) {
                    console.log(fieldsFlattened)
                    dbActions[tableName].push(() => {
                        return table.create({
                            data: {
                                ...fieldsFlattened,
                                fieldUpdates: fieldsUpdateDates
                            }
                        })
                    })
                }
                // UPDATE
                else if (record.action == SyncAction.UPDATE) {
                    dbActions[tableName].push(async () => {
                        const itemToBeUpdated = await table.findUnique({where: {id: record.id}});
                        const currentFieldsUpdateDates = itemToBeUpdated.fieldUpdates;
                        const fieldsFlattenedFiltered:{[key:string]:any} = {};
                        const fieldsUpdatesFiltered:{[key:string]:any} = {}; 

                        Object.keys(fieldsFlattened).forEach(fieldName => {
                            if (fieldName === 'id') return;

                            let lastUpdate = currentFieldsUpdateDates[fieldName];
                            // Avoid updating stuff with same value (merging approach)
                            if ((fieldsUpdateDates[fieldName] >= lastUpdate || !lastUpdate) && itemToBeUpdated[fieldName] != fieldsFlattened[fieldName]) {
                                fieldsFlattenedFiltered[fieldName] = fieldsFlattened[fieldName];
                                fieldsUpdatesFiltered[fieldName] = fieldsUpdateDates[fieldName];
                            }
                        })

                        if (Object.keys(fieldsFlattenedFiltered).length === 0) {
                            return new Promise((resolve) => resolve(null))
                        }


                        return table.update(
                            {
                                where: {
                                    id: record.id
                                },
                                data: {
                                    ...fieldsFlattenedFiltered,
                                    fieldUpdates: fieldsUpdatesFiltered
                                }
                            }
                        )
                    })
                }
                // DELETE
                else if (record.action == SyncAction.DELETE) {
                    dbActions[tableName].push(() => {
                        // SOFT DELETE ONLY
                        return table.update(
                            {
                                where: {
                                    id: record.id,
                                },
                                data:{
                                    deletedAt: syncStartedAt
                                }
                            }
                        )
                    })
                }


            })
            
        })

        const fullResults = [];
        for (let i = 0; i < this.tablesOrderedForRelationResolution.length; i++) {
            if (!dbActions[this.tablesOrderedForRelationResolution[i]]) continue;

            const results = await Promise.all(dbActions[this.tablesOrderedForRelationResolution[i]].map(task => task()));
            fullResults.push(results)
        }

        return fullResults;
    }

}
