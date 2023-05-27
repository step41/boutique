; (function() {

    'use strict';
	
	Boutique.Controllers.Product = {
		
		block: null,
		formList: null,
		formWrite: null,
		ov: null,
		prefix: '#product',
		
		bindEvents: function() {

			var BCP = Boutique.Controllers.Product;
			
			$(BCP.prefix + '-list').off('click').on('click', function(e) {

				BCP.show(e);

			});
			
			BCP.formList.find('.remove-element').off('click').on('click', function() {
				
				BCP.remove(this);
				
			});

			$(BCP.prefix + '_add').off('click').on('click', function() {
				
				BCP.save(this);
				
			});

			$(BCP.prefix + '_upd').off('click').on('click', function() {
				
				BCP.save(this);
				
			});

			$(BCP.prefix + '_del').off('click').on('click', function() {
				
				BCP.remove(this);
				
			});

		},
		
		delete: function(id) {

			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;
			
			if (id) {
			
				$.ajax({
					type: 'post',
					// Note: Due to a bug in jQuery, do not include trailing slashes on ajax PBST requests
					// Doing so will prevent the default data and other attributes in globals.js.php from
					// being included and therefore 401 errors will occurr due to missing CSRF token.
					url: API_PATH + '/products/delete/' + id,
					data: BCP.formList.cerealize(),
					beforeSend: function() {
						BM.progress(BS.t('messageDeleting'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.set(data, status, xhr);
					}
				});
				return false;
			}
			
		},
		
		duplicate: function() {
			
			var BCP = Boutique.Controllers.Product;
						
			BCP.itemId = null;
			$(BCP.prefix + '_id').val('');
			
		},
		
		edit: function(callback) {
			
			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;

			if (BCP.itemId) {

				BCP.reset();	
				
				$.ajax({
					type: 'get',
					url: API_PATH + '/products/edit/' + BCP.itemId + '/',
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.formWrite.decerealize(data);
						BU.initPscroll(BCP.dialog);
						BM.hide(BCP.block);
						
						BCP.lastId = BCP.itemId;
						
						if (typeof (callback || undefined) === 'function') {
							callback.call();
						}

					}
				});
			}
			
		},
		
		hide: function() {
			
			var BCP = Boutique.Controllers.Product;
			
			BCP.dialog.modal('hide');
		
		},

		index: function() {
			
			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;

			BCP.block = $('body');
					
			$.ajax({
				type: 'get',
				url: API_PATH + '/products/',
				data: BCP.formList.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageLoading'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.formList.find('.content-ajaxload').html(data);		
					BCP.bindEvents();
					BU.initSelectPicker(BCP.form);
					BU.initPscroll(BCP.form);								
					BU.initTooltips(BCP.formList);							
					BM.hide(BCP.block);
				}
			});
			
		},

		init: function() {

			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			
			BCP.dialog = $(BCP.prefix + '_dialog');
			BCP.formList = $(BCP.prefix + '_form_list');
			BCP.formWrite = $(BCP.prefix + '_form_write');
			
			BCP.hide();
			BCP.bindEvents();
			
		},

		remove: function(o) {

			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;
			
			var id = (BCP.itemId) ? BCP.itemId : $(o).closest('[data-id]').data('id');
			
			if (id) {
			
				BCP.block = ($(BCP.prefix + '_dialog:visible').length) ? BCP.dialog.find('.modal-content') : $('body');
				
				bootbox.confirm({
					title: 'Confirm',
					message: '<p class="center">' + BS.t('messageConfirmDelete') + '</p>',
					callback: function(ok) {
						if (ok) {
							BCP.delete(id);
						}
					}
				});
				return false;
			}
			
		},
		
		reset: function() {

			var BCP = Boutique.Controllers.Product;
			var OV = Boutique.Validator;
			
			/* Reset all visible fields */
			if (BCP.formWrite.length) {
				BCP.formWrite.get(0).reset();
				OV.clearErrors(BCP.formWrite);
			}
			
			/* Reset hidden id field manually since reset doesn't clear hidden fields */
			$(BCP.prefix + '_id').val('');
				
		},
		
		// saves a new item back to the database
		save: function() {
			
			var BCP = Boutique.Controllers.Product;
			var BU = Boutique.Utilities;
			var BM = Boutique.Messages;
			var BS = Boutique.Settings;
			var OV = Boutique.Validator;

			var id = (BCP.itemId) ? BCP.itemId + '/' : '';
			BCP.ov = OV.build(BCP.formWrite);
			
			if (BCP.ov.hasErrors()) {
				return false;
			}
		
			OV.clearErrors(BCP.formWrite);

			$.ajax({
				type: 'post',
				url: API_PATH + '/products/save/' + id,
				data: BCP.formWrite.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageSaving'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.set(data, status, xhr);
				}
			});

		},
		
		set: function(data, status, xhr) {
			
			var BCP = Boutique.Controllers.Product;
			var BM = Boutique.Messages;

			//BM.response(data, status, xhr, BCP.block, BCP.hide);
			BM.response(data, status, xhr, BCP.block, BCP.init);
				
		},
			
		show: function(e) { 
		
			const BCP = Boutique.Controllers.Product;
			const BU = Boutique.Utilities;
			
			if (e) {

				BCP.block = BCP.dialog.find('.modal-content');
				BCP.itemId = (e.target && e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				if (BCP.itemId) {
					$(BCP.prefix + '_add').hide();	
					$(BCP.prefix + '_del, ' + BCP.prefix + '_upd').show();	
				}
				else {
					$(BCP.prefix + '_add').show();	
					$(BCP.prefix + '_del, ' + BCP.prefix + '_upd').hide();	
					BCP.reset();	
				}
				
				//BU.setDialogTitle(BCP.dialog, BCP.itemId);

				BCP.dialog.modal('show');
				BCP.dialog.off('shown.bs.modal').on('shown.bs.modal', function() {
					
					// Load item record if valid id is passed
					if (BCP.itemId) {
						BCP.edit();
					}
					
				});		
					
			}

		},

	};

	$(function() {
		Boutique.Controllers.Product.init();
	});       

})();

