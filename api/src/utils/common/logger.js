// @ts-check

/**
 * @typedef {'create' | 'delete' | 'update' | 'request'} LoggerEvent
 * @typedef {'ticket' | 'payment' | 'order' | 'service' | 'invoice' | 'transaction' | 'user' | 'cancellation' | 'todo' | 'coupon' | 'settings'} LoggerCategory
 * @typedef {Record<string, any>} LoggerMetadata
 * @typedef {object} LoggerParams
 * @property {import('fastify').FastifyRequest} [req]
 * @property {LoggerCategory} category
 * @property {LoggerEvent} event
 * @property {string} user_id
 * @property {string} message
 * @property {LoggerMetadata} [metadata]
 */

/** @type {{ info(p: LoggerParams): void; warn(p: LoggerParams): void; error(p: LoggerParams): void }} */
export const logger = {
    /** @param {LoggerParams} p */
    info(p) {
        const { req, category, event, user_id, message, metadata } = p;
        console.info({ level: "info", req, category, event, user_id, message, metadata });
    },

    /** @param {LoggerParams} p */
    warn(p) {
        const { req, category, event, user_id, message, metadata } = p;
        console.warn({ level: "warn", req, category, event, user_id, message, metadata });
    },

    /** @param {LoggerParams} p */
    error(p) {
        const { req, category, event, user_id, message, metadata } = p;
        console.error({ level: "error", req, category, event, user_id, message, metadata });
    },
};
