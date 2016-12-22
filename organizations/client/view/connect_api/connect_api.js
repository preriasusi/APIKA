import { Template } from 'meteor/templating';
// TODO: import OrganizationApis module
import { OrganizationApis } from '/organizations/collection';

Template.connectApiToOrganizationModal.onCreated(function () {
  const templateInstance = this;
  // Get first item from apis list
  const api = templateInstance.data.apis[0];
  //  Save first api as default value
  templateInstance.selectedApi = api._id;
  // TODO: Subscription to OrganizationApis module
  templateInstance.subscribe('orgApis');
});

Template.connectApiToOrganizationModal.events({
  'change [name="managed-apis"]': (event, templateInstance) => {
    // Save selected api
    templateInstance.selectedApi = event.currentTarget.value;
  },
  'click #save-connected-api': (event, templateInstance) => {
    // Get organization that api will be connected to
    const organizationId = templateInstance.data.organizationId;
    // Get id of selected API
    const api = templateInstance.selectedApi;
    // Try to find OrganizationApis module
    const newOrg = OrganizationApis.findOne({ organizationId });

    // TODO: remove checking when OrganizationApis module will be synced with organization collection
    if (newOrg) {
      // Insert selected api to organization
      OrganizationApis.update(newOrg._id, { $push: { apiIds: api } });
    } else {
      // Insert selected api to organization
      OrganizationApis.insert({ organizationId, apiIds: [api] });
    }
  },
});
