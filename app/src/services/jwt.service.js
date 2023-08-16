const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const redisClient = require('../config/redis');

const signAccessToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_ACCESS_JWT, { expiresIn: `${process.env.ACCESS_EXPIRED_IN}s` }, (err, accessToken) => {
            if(err){
                reject(err);
            } 
            resolve(accessToken);
        }); 
    });
}

const signRefreshToken = async (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.SECRET_REFRESH_JWT, { expiresIn: `${process.env.REFRESH_EXPIRED_IN}s` }, (err, refreshToken) => {
            if(err){
                reject(err);
            } 
            redisClient.set(payload._id.toString(), refreshToken, 'EX', process.env.REFRESH_EXPIRED_IN, (err, reply) => {
                if(err){
                    return reject(createError.InternalServerError());
                }
                resolve(refreshToken);
            });
        }); 
    });
}

const verifyRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        // Verify token
        jwt.verify(refreshToken, process.env.SECRET_REFRESH_JWT, (err, payload) => {
            if(err){
                return reject(err);
            }
            redisClient.get(payload._id.toString(), (err, reply) => {
                if(err){
                    return reject(createError.InternalServerError());
                }
                if(refreshToken === reply){
                    return resolve(payload);
                }
                return reject(createError.Unauthorized());
            })
        });
    });
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken
}