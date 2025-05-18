import databaseConfig from "../configs/database-config.js"

export const addContactModel = ({ name, email, subject, message }) => {
    return {
        poolConfig: databaseConfig.poolConfig,
        params: [name, email, subject, message],
        schemaName: databaseConfig.schemaName,
        sqlFunctionName: databaseConfig.psqlFunction_insertContact
    }
}