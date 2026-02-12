import type { RequestHandler } from "express";
import * as AircraftsService from '@/services/aircrafts.service';

export const getAircraftsDataToSync:RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send();


    const lastSyncString = req.query.last_sync ? req.query.last_sync as string : null;
    
    let lastSync:Date|undefined = undefined;
    if (lastSyncString) {
        lastSync = new Date(lastSyncString);
    }
    AircraftsService.getAllUnsyced(lastSync).then((data:object) => {
        res.json(data);
    })
}


export const pushAircraftsDataToSync:RequestHandler = async (req, res, next) => {
    AircraftsService.pushToSync(req.body.data);
    res.json({});
}

export default {
    getAircraftsDataToSync,
    pushAircraftsDataToSync
}