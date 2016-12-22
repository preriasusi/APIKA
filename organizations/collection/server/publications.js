import { Meteor } from 'meteor/meteor';
import { Organizations, OrganizationApis } from '../';

Meteor.publish('singleOrganization', (slug) => Organizations.find({ slug }));

Meteor.publish('allOrganizationBasicDetails', () => {
  return Organizations.find({},
    { fields: {
      _id: 1,
      name: 1,
      description: 1,
      contact: 1,
    },
    });
});

// Publish collection for pagination
new Meteor.Pagination(Organizations);

// TODO: Remove it
Meteor.publish('orgApis', () => OrganizationApis.find());
