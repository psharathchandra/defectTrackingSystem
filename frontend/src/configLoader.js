// Load config from process.env or fall back to static config
import staticConfig from './config.json';

const configLoader = () => {
  return {
    SERVER_URL: process.env.SERVER_URL || staticConfig.SERVER_URL || 'http://localhost:8080/api/',
    BE_SERVER_URL: process.env.SERVER_URL || staticConfig.BE_SERVER_URL || 'http://localhost:8080/api/',
    USERS_TABLE_LENGTH: parseInt(process.env.USERS_TABLE_LENGTH) || staticConfig.USERS_TABLE_LENGTH || 2,
    BUGS_TABLE_LENGTH: parseInt(process.env.BUGS_TABLE_LENGTH) || staticConfig.BUGS_TABLE_LENGTH || 2,
    REPORTS_PAGE_TITLE: process.env.REPORTS_PAGE_TITLE || staticConfig.REPORTS_PAGE_TITLE,
    PROJECTS_PAGE_TITLE: process.env.PROJECTS_PAGE_TITLE || staticConfig.PROJECTS_PAGE_TITLE,
    DEFECTS_PAGE_TITLE: process.env.DEFECTS_PAGE_TITLE || staticConfig.DEFECTS_PAGE_TITLE,
    USERS_PAGE_TITLE: process.env.USERS_PAGE_TITLE || staticConfig.USERS_PAGE_TITLE,
    APP_TITLE: process.env.APP_TITLE || staticConfig.APP_TITLE,
    USER_LINK_NAME: process.env.USER_LINK_NAME || staticConfig.USER_LINK_NAME,
    PROJECT_LINK_NAME: process.env.PROJECT_LINK_NAME || staticConfig.PROJECT_LINK_NAME,
    DEFECTS_LINK_NAME: process.env.DEFECTS_LINK_NAME || staticConfig.DEFECTS_LINK_NAME,
    REPORTS_LINK_NAME: process.env.REPORTS_LINK_NAME || staticConfig.REPORTS_LINK_NAME,
    DATE_FORMAT_OBJECT: staticConfig.DATE_FORMAT_OBJECT,
    DATE_REGION: process.env.DATE_REGION || staticConfig.DATE_REGION,
  };
};

export default configLoader();
