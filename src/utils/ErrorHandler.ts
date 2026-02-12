import type { Request, Response, NextFunction } from "express";
import Env from "./Env";

export default function(error:Error, req:Request, res:Response, next:NextFunction) {
    res.status(500).json({
        error: Env.env == Env.types.DEVELOPMENT ? error.toString() : "Erro inesperado. Nossa equipe foi notificada e em breve corrigirá o problema."
    });
}