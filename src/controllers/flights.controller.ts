import type { RequestHandler } from "express";
import * as FlightsService from '@/services/flights.service';

export const getFlightsDataToSync:RequestHandler = async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).send();


    const lastSyncString = req.query.last_sync ? req.query.last_sync as string : null;
    const filters = req.query.filter ? JSON.parse(req.query.filter as string) : {}
    console.log(filters, req.query.filter)
    
    let lastSync:Date|undefined = undefined;
    if (lastSyncString) {
        lastSync = new Date(lastSyncString);
    }
    FlightsService.getAllUnsyced(lastSync, filters).then((data:object) => {
        res.json(data);
    })
}


export const pushFlightsDataToSync:RequestHandler = async (req, res, next) => {
    FlightsService.pushToSync(req.body.data);
    res.json({});
}

export default {
    getFlightsDataToSync,
    pushFlightsDataToSync
}