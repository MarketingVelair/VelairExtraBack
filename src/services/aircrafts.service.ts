import prisma from '@/config/prisma';
import SyncBasedService, {DataToSync} from '@/utils/SyncbasedService';


const sync = new SyncBasedService({
    aircraft: {
        table: prisma.aircraft,
        editableFields: ['modelFullName', 'modelIcaoName', 'registration']
    },
}, [
    'aircraft',
]);


export const getAllUnsyced = async (lastSync?:Date) => {
    const results = sync.getAllUnsyced(lastSync);
    return results;
};


export const pushToSync = async (dataToSync:DataToSync) => {
    const results = sync.pushToSync(dataToSync);
    return results;
}
