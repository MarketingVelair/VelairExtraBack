import type { RequestHandler } from "express";
import * as ExamsService from '@/services/exams.service';

export const getExamsDataToSync:RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send();


    const lastSyncString = req.query.last_sync ? req.query.last_sync as string : null;
    
    let lastSync:Date|undefined = undefined;
    if (lastSyncString) {
        lastSync = new Date(lastSyncString);
    }
    ExamsService.getAllUnsyced(lastSync).then((data:object) => {
        res.json(data);
    })
}


export const pushExamsDataToSync:RequestHandler = async (req, res, next) => {
    ExamsService.pushToSync(req.body.data);
    res.json({});
}

export default {
    getExamsDataToSync,
    pushExamsDataToSync
}