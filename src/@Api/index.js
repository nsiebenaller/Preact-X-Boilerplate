export const IS_DEV = process.env.NODE_ENV === 'prod' ? false : true

export * from './routes/application.js'
export * from './routes/compliance.js'
export * from './routes/contacts.js'
export * from './routes/file.js'
export * from './routes/fundingOpportunity.js'
export * from './routes/lov.js'
export * from './routes/mechanism.js'
export * from './routes/program.js'
export * from './routes/reports.js'
export * from './routes/technicalReports.js'
export * from './routes/user.js'
