import type { RequestHandler } from "express";
import * as InstructorsService from '@/services/instructors.service';

export const getInstructorsDataToSync: RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send();


    const lastSyncString = req.query.last_sync ? req.query.last_sync as string : null;

    let lastSync: Date | undefined = undefined;
    if (lastSyncString) {
        lastSync = new Date(lastSyncString);
    }
    InstructorsService.getAllUnsyced(lastSync).then((data: object) => {
        res.json(data);
    })
}


export const pushInstructorsDataToSync: RequestHandler = async (req, res, next) => {
    InstructorsService.pushToSync(req.body.data);
    res.json({});
}

export default {
    getInstructorsDataToSync,
    pushInstructorsDataToSync
}