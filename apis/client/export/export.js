import { Template } from 'meteor/templating';
import { ProxyBackends } from '/proxy_backends/collection';

import jsyaml from 'js-yaml';

Template.apiExport.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the API Backend ID from data context
  const apiId = instance.data.api._id;

  // Subscribe to proxy settings for this API
  instance.subscribe('apiProxySettings', apiId);
});

Template.apiExport.events({
  'click #exportJSONConfig': function (event, instance) {
    // Get API Backend from database collection
    const api = instance.data.api;

    // converts JSON object to JSON string and adds indentation
    const json = JSON.stringify(api, null, '\t');

    // creates file object with content type of JSON
    const file = new Blob([json], { type: 'application/json;charset=utf-8' });

    // forces "save As" function allow user download file
    saveAs(file, 'apiConfig.json');
  },
  'click #exportYAMLConfig': function (event, instance) {
    // Get API Backend from database collection
    const api = instance.data.api;

    // converts from json to yaml
    const yaml = jsyaml.safeDump(api);

    // creates file object with content type of YAML
    const file = new Blob([yaml], { type: 'application/x-yaml;charset=utf-8' });

    // forces "save As" function allow user download file
    saveAs(file, 'apiConfig.yaml');
  },
  'click #exportJSONProxyConfig': function (event, instance) {
    // Get the API Backend ID from data context
    const apiId = instance.data.api._id;

    // Find proxy backends by API id
    const proxy = ProxyBackends.findOne({ apiId });

    // converts JSON object to JSON string and adds indentation
    const json = JSON.stringify(proxy, null, '\t');

    // creates file object with content type of JSON
    const file = new Blob([json], { type: 'application/json;charset=utf-8' });

    // forces "save As" function allow user download file
    saveAs(file, 'apiProxyConfig.json');
  },
  'click #exportYAMLProxyConfig': function (event, instance) {
    // Get the API Backend ID from data context
    const apiId = instance.data.api._id;

    // Find proxy backends by API id
    const proxy = ProxyBackends.findOne({ apiId });

    // converts from json to yaml
    const yaml = jsyaml.safeDump(proxy);

    // creates file object with content type of YAML
    const file = new Blob([yaml], { type: 'application/x-yaml;charset=utf-8' });

    // forces "save As" function allow user download file
    saveAs(file, 'apiConfig.yaml');
  },
});
