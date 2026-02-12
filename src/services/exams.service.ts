import prisma from '@/config/prisma';
import SyncBasedService, {DataToSync} from '@/utils/SyncbasedService';



const sync = new SyncBasedService({
    examTemplate: {
        table: prisma.examTemplate,
        editableFields: ['title', 'enableMaxTime', 'maxTimeSeconds']
    },
    examTemplateQuestion: {
        table: prisma.examTemplateQuestion,
        editableFields: ['value', 'orderIndex', 'examTemplateId', 'questionId']
    },
    examQuestion: {
        table: prisma.examQuestion,
        editableFields: ['text', 'themeId', 'type', 'value']
    },
    examMultiChoiceOption: {
        table: prisma.examMultiChoiceOption,
        editableFields: ['title', 'questionId', 'isCorrect']
    },
    examQuestionTheme: {
        table: prisma.examQuestionTheme,
        editableFields: ['title']
    }
}, [
    'examQuestionTheme',
    'question',
    'examMultiChoiceOption',
    'examTemplate',
    'examQuestion'
]);


export const getAllUnsyced = async (lastSync?:Date) => {
    const results = sync.getAllUnsyced(lastSync);
    return results;
};


export const pushToSync = async (dataToSync:DataToSync) => {
    const results = sync.pushToSync(dataToSync);
    return results;
}
