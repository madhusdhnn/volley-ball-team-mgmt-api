import moment from "moment";

const withLocale = (locale = "en") => {
  moment.locale(locale);
  return moment;
};

export default withLocale;
