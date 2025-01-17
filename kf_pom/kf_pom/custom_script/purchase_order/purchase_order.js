frappe.ui.form.on("Purchase Order",{
	setup: function(frm) {
		console.log('In setup')
		frappe.flag_for_category = 0
	},
	refresh:function(frm){
		if(frappe.user.has_role('Procurement  Approver')) {
			frm.set_df_property('is_internal_po','hidden',0)
		} else {
			frm.set_df_property('is_internal_po','hidden',1)
		}
		if(frm.doc.is_internal_po == 1) {
			frm.set_df_property('billing_address','reqd',1)
		} else {
			frm.set_df_property('kf_sub_location','reqd',0)
		}
		if(frm.doc.kf_purchase_requisition) {
			frm.toggle_enable('is_internal_po',0)
		} else {
			frm.toggle_enable('is_internal_po',1)
		}
		frm.toggle_enable('kf_customer',frm.doc.is_internal_po == 1)
		frm.toggle_enable('kf_customer_shipping_address',frm.doc.is_internal_po == 1)
		frm.toggle_enable('billing_address',frm.doc.is_internal_po == 1)
		cur_frm.fields_dict['sub_category'].get_query = function(doc, cdt, cdn) {
		    return {
		        filters: [
		            		['Sub Category','category', '=', frm.doc.category]
						]
			}
		}
		if(frm.doc.workflow_state == 'Vendor Approved' && frappe.user.has_role('Vendor')) {
			//show print option 
		} else if (frm.doc.workflow_state != 'Vendor Approved' && frappe.user.has_role('Vendor')){
			//hide print option 
			$('.text-muted.btn.btn-default.icon-btn[data-original-title="Print"]').hide()
		}
		if(frappe.user.has_role('Vendor')){
			//hide comments
			$('.timeline-items').hide();
		// 	//hide comment box
		// 	$('.comment-box').hide();
			// frm.set_df_property("approver_comments","hidden",1)
		}
		if(frm.is_new()){
			frm.set_value("tc_name",'Standard Template')
			frm.set_value("kf_contact_name","Sarvesh Tiwari")
            frm.set_value("kf_contact_email","sarvesh.tiwari@in.knightfrank.com")
            frm.set_value("kf_contact_no","8291900219")

		}
	},
	is_internal_po: function(frm) {
		if(frm.doc.is_internal_po == 1) {
			if(frm.doc.__islocal){
				frm.set_value('schedule_date',frappe.datetime.add_days(frappe.datetime.get_today(), 3))
				if(frm.doc.is_internal_po == 1) {
					frm.set_df_property('billing_address','reqd',1)
				} else {
					frm.set_df_property('billing_address','reqd',0)
				}
			}
			frm.toggle_enable('kf_customer',1)
			frm.toggle_enable('kf_customer_shipping_address',1)
			frm.toggle_enable('billing_address',1)
			frm.set_value('kf_customer_shipping_address','')
			frm.set_value('billing_address','')
			frm.set_query("kf_customer", function(){
		        return {
		            "filters": [
		                ["Customer", "is_internal_customer", "=", 1]
		            ]
		        }
		    });

		    frm.set_query('kf_customer_shipping_address', function(doc) {
	            if(!doc.kf_customer) {
	                frappe.throw(_('Please select Customer'));
	            }

	            return {
	                // query: 'frappe.contacts.doctype.address.address.address_query',
	                query: 'kf_pom.kf_pom.custom_script.purchase_order.purchase_order.address_query',
	                filters: {
	                    link_doctype: 'Company',
	                    link_name: doc.company
	                }
	            };
	        });
		} else {
			frm.toggle_enable('kf_customer',0)
			frm.toggle_enable('kf_customer_shipping_address',0)
			frm.toggle_enable('billing_address',0)
			frm.set_value('kf_customer_shipping_address','')
			frm.set_value('kf_customer_shipping_address_display','')
			frm.set_value('billing_address','')
			frm.set_value('kf_customer','')
			}
	},
	kf_customer_shipping_address: function(frm) {
		if(frm.doc.is_internal_po == 1) {
	        //to fetch customer address on PO
	        if(frm.doc.kf_customer_shipping_address) {
	            frappe.call({
	                method: "frappe.contacts.doctype.address.address.get_address_display",
	                args: {"address_dict": frm.doc.kf_customer_shipping_address },
	                callback: function(r) {
	                    if(r.message) {
	                        console.log(r.message)
	                        frm.set_value("kf_customer_shipping_address_display", r.message)
	                    }
	                }
	            })
	        }
	    }
    },
	onload:function(frm){
		if(frappe.user.has_role('Procurement  Approver')) {
			frm.set_df_property('is_internal_po','hidden',0)
		} else {
			frm.set_df_property('is_internal_po','hidden',1)
		}
		if(frm.doc.kf_purchase_requisition) {
			frm.toggle_enable('is_internal_po',0)
		} else {
			frm.toggle_enable('is_internal_po',1)
		}
		if(frm.doc.is_internal_po == 1) {
			frm.set_df_property('billing_address','reqd',1)
		} else {
			frm.set_df_property('kf_sub_location','reqd',0)
		}
		frappe.flag_for_category = 1
    	// frm.set_value('kf_purchase_requisition',frm.doc.items[0].material_request)

		if(frm.is_new()){
			frm.set_value("tc_name",'Standard Template')
			frm.set_value("kf_contact_name","Sarvesh Tiwari")
            frm.set_value("kf_contact_email","sarvesh.tiwari@in.knightfrank.com")
            frm.set_value("kf_contact_no","8291900219")

			if(frm.doc.company_billing_add){
				frm.set_value('billing_address',frm.doc.company_billing_add)
			}
		}
		if(frm.doc.workflow_state == 'Vendor Approved' && frappe.user.has_role('Vendor')) {
			//show print option 
		} else if (frm.doc.workflow_state != 'Vendor Approved' && frappe.user.has_role('Vendor')){
			//hide print option 
			$('.text-muted.btn.btn-default.icon-btn[data-original-title="Print"]').hide()
		}
		if(frappe.user.has_role('Vendor')){
			//hide comments
			$('.timeline-items').hide();
		// 	//hide comment box
		// 	$('.comment-box').hide();
			// frm.set_df_property("approver_comments","hidden",1)
		}
	},
	category: function(frm) {
		if (frappe.flag_for_category == 1) {
	        if(frm.doc.category){
	        	frm.set_value('sub_category','')
	            cur_frm.fields_dict['sub_category'].get_query = function(doc, cdt, cdn) {
	                return {
	                    filters: [
	                                ['Sub Category','category', '=', frm.doc.category]
	                            ]
	                }
	            } 
	        } else {
	            frm.set_value('sub_category','')
	        }
    	} else {
    		if(frm.doc.category){
	        	// frm.set_value('sub_category','')
	            cur_frm.fields_dict['sub_category'].get_query = function(doc, cdt, cdn) {
	                return {
	                    filters: [
	                                ['Sub Category','category', '=', frm.doc.category]
	                            ]
	                }
	            } 
	        } else {
	            frm.set_value('sub_category','')
	        }
    	}
    },
	kf_contact_email: function(frm) {
        if(frm.doc.kf_contact_email) {
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    'doctype': 'User',
                    'filters': {'name': frm.doc.kf_contact_email},
                    'fieldname': [
                        'mobile_no',
                        'full_name'
                    ]
                },
                callback: function(r) {
                    if (!r.exc) {
                        // code snippet
                        if(r.message){
                            frm.set_value("kf_contact_name",r.message.full_name)
                            frm.set_value("kf_contact_no",r.message.mobile_no)
                        }
                    }
                }
            });
        } else {
            frm.set_value("kf_contact_name","")
            frm.set_value("kf_contact_no","")
        }
    },
	company_billing_add:function(frm) {
		if(frm.doc.company_billing_add) {
			frm.set_value('billing_address',frm.doc.company_billing_add)
			frm.set_value('shipping_address',frm.doc.company_billing_add)
		}
	},
	supplier: function(frm){
		if(frm.doc.company_billing_add) {
			frm.set_value('billing_address',frm.doc.company_billing_add)
			frm.set_value('shipping_address',frm.doc.company_billing_add)
		}
	},
	validate:function(frm){
        var from_date=new Date(frm.doc.po_validity_from_date);
        var to_date=new Date(frm.doc.po_validity_to_date);
    	if (from_date && to_date){
    		if (from_date>to_date){
    			frappe.throw("From Date Should not Exceed To Date")
    		}
    	}
    	frm.set_value('kf_purchase_requisition',frm.doc.items[0].material_request)
    }
});