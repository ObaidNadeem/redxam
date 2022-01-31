import axiosModule from 'axios';

const { NODE_ENV, MX_PROD_BASE_URL, MX_DEV_BASE_URL, MX_API_KEY, MX_CLIENT_ID } =
  process.env;

const axios = axiosModule.create({
  baseURL: NODE_ENV === 'production' ? MX_PROD_BASE_URL : MX_DEV_BASE_URL,
  headers: {
    Accept: 'application/vnd.mx.api.v1+json',
    ContentType: 'application/json',
  },
  auth: {
    username: MX_CLIENT_ID,
    password: MX_API_KEY,
  },
});

export const createUser = async user => {
  const userData = {
    email: user.email,
    id: user._id,
    is_disabled: false,
  };
  const res = await axios.post('/users', { user: userData });
  if (res.status === 200) {
    return res.data.user;
  }
  throw new Error(res.data.error);
};

export const getWidgetUrl = async (user_guid: string) => {
  const widgetObj = {
    widget_url: {
      widget_type: 'connect_widget',
      color_scheme: 'light',
      current_institution_code: 'chase',
      current_institution_guid: 'INS-f1a3285d-e855-b61f-6aa7-8ae575c0e0e9',
      current_member_guid: 'MBR-7c6f361b-e582-15b6-60c0-358f12466b4b',
      disable_institution_search: false,
      include_transactions: true,
      is_mobile_webview: true,
      mode: 'aggregation',
      ui_message_version: 4,
      ui_message_webview_url_scheme: 'mx',
      update_credentials: false,
      wait_for_full_aggregation: false,
    },
  };
  const widgetRes = await axios.post(`/users/${user_guid}/connect_widget_url`, widgetObj);
  if (widgetRes.status === 200) {
    return widgetRes.data.user.connect_widget_url;
  }
  throw new Error(widgetRes.data.error);
};

export default { createUser, getWidgetUrl };
