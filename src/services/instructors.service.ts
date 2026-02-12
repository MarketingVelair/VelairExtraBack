import prisma from '@/config/prisma';
import SyncBasedService, { DataToSync } from '@/utils/SyncbasedService';


const sync = new SyncBasedService({
    instructor: {
        table: prisma.instructor,
        editableFields: ['name', 'cpf', 'address', 'state', 'city', 'rg', 'id_emitter', 'id_emission_date', 'postalCode', 'sex', 'phone', 'nationality', 'naturalization', 'canac', 'user']
    },
}, [
    'instructor',
]);


export const getAllUnsyced = async (lastSync?: Date) => {
    const results = sync.getAllUnsyced(lastSync);
    return results;
};


export const pushToSync = async (dataToSync: DataToSync) => {
    const results = sync.pushToSync(dataToSync);
    return results;
}
