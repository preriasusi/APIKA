import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Modal } from 'meteor/peppelg:bootstrap-3-modal';
import { Roles } from 'meteor/alanning:roles';

import { Apis } from '/apis/collection';
import { Organizations } from '/organizations/collection/';

import _ from 'lodash';

Template.organizationProfile.onCreated(function () {
  // Get reference to template instance
  const instance = this;

  // Get the Organization slug from the route
  instance.organizationSlug = FlowRouter.getParam('slug');

  // Subscribe to APIs
  instance.subscribe('allApiBackends', Meteor.userId());
  // Subscribe to a single Organization
  instance.subscribe('singleOrganization', instance.organizationSlug);
});

Template.organizationProfile.helpers({
  organization () {
    // Get single Organization
    return Organizations.findOne();
  },
  managedApis () {
    // Find relate organization document
    const organization = Organizations.findOne();

    // Get organization id
    const organizationId = organization._id;

    return Apis.find({ organizationId }).fetch();
  },
  managedApisCount () {
    // Find relate organization document
    const organization = Organizations.findOne();

    // Get organization id
    const organizationId = organization._id;
    return Apis.find({ organizationId }).count();
  },
  userCanConnectApi () {
    // Find relate organization document
    const organization = Organizations.findOne();

    const userId = Meteor.userId();

    // Check if user is administrator
    const userIsAdmin = Roles.userIsInRole(userId, ['admin']);

    if (userIsAdmin) {
      // Then show button
      return true;
    }

    // User is organization manager
    const userIsManager = _.includes(organization.managerIds, userId);
    // User has at least one managed api which doesn't connect to any organization
    const apisCount = Apis.find({ managerIds: userId }).count();

    // Show button if both conditions are true
    return userIsManager && apisCount > 0;
  },
});

Template.organizationProfile.events({
  'click #connect-api': () => {
    const userId = Meteor.userId();

    // Query to find all APIs without connection to Organization
    const queryParams = { organizationId: { $exists: false } };

    // Is user no admin
    if (!Roles.userIsInRole(userId, ['admin'])) {
      // Add condition to find managed apis
      queryParams.managerIds = userId;
    }
    // Get apis
    const apis = Apis.find(queryParams).fetch();

    // Show modal with list of suggested apis
    Modal.show('connectApiToOrganizationModal', { apis });
  },
});
