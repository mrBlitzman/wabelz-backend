const mongoose = require('mongoose');
const { Schema } = mongoose;

const isCustomPkg = function() {
    return this.custom_pkg !== undefined;
  };

const domainServiceRequired = function() {
    if (this.custom_pkg && this.custom_pkg.domain.isIncluded) {
        return true;
    }
    return false;
};

const hostingServiceRequired = function() {
    if (this.custom_pkg && this.custom_pkg.hosting.isIncluded) {
        return true;
    }
    return false;
};

const extrasValidation = function(value) {
    if (this.custom_pkg) {
      return !value || value.length === 0;
    }
    if (this.id && value) {
      return true;
    }
    return true;
  };

const orderSchema = new Schema({
  customer_details: {
    name_surname: { type: String, required: true },
    mail_addr: { type: String, required: true },
    country: { type: String, required: true },
    phone_num: { type: String, required: true },
    department: { type: String, required: true }
  },
  order_details: {
    website: {
      type: { type: String, required: true },
      prior_goal: { type: String, required: true },
      short_desc: { type: String, required: true }
    },
    products: [
      {
        id: { type: String, required: function() { return !this.custom_pkg; } },
        custom_pkg: {
            page_num: { type: Number, required: isCustomPkg },
            revision_num: { type: Number, required: isCustomPkg },
            design_features: [
              { advanced_animations: { type: Boolean, required: isCustomPkg } },
              { dark_light_mode: { type: Boolean, required: isCustomPkg } },
              { logo_design: { type: Boolean, required: isCustomPkg } },
              { video_bg_integration: { type: Boolean, required: isCustomPkg } },
              { photo_slideshows: { type: Boolean, required: isCustomPkg } },
            ],
            functionalities: [
              { live_chat_integration: { type: Boolean, required: isCustomPkg } },
              { product_management: { type: Boolean, required: isCustomPkg } },
              { login_register: { type: Boolean, required: isCustomPkg } },
              { admin_panel: { type: Boolean, required: isCustomPkg } },
              { e_commerce_functionality: { type: Boolean, required: isCustomPkg } },
              { cart_integration: { type: Boolean, required: isCustomPkg } },
              { blog_management: { type: Boolean, required: isCustomPkg } },
            ],
            maintenance_duration: { type: Number, required: isCustomPkg }, //in months
            maintenance_type: { type: String, required: isCustomPkg },
            domain: {
              isIncluded: { type: Boolean, required: isCustomPkg },
              domain_service: {
                domain_name: {
                  type: String,
                  required: domainServiceRequired
                },
                duration: { type: Number, required: domainServiceRequired }, //in months
                required: domainServiceRequired
              }
            },
            hosting: {
              isIncluded: { type: Boolean, required: isCustomPkg },
              hosting_service: {
                package_name: { 
                  type: String, 
                  required: hostingServiceRequired
                },
                duration: { type: Number, required: hostingServiceRequired }, //in months
                required: hostingServiceRequired
              }
            },
            required: function() { return !this.packageID; }
        },
        extras: {
            type: [Number],
            validate: [extrasValidation, 'Extras cannot be provided when custom_pkg is selected or id is not set.']
        }
      }
    ]
  }
});

const Order = mongoose.model('Order', orderSchema);


export default Order;
