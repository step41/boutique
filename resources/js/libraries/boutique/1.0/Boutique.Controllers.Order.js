; (function() {

    'use strict';
	
	Boutique.Controllers.Order = {
		
		action: null,
		block: null,
		lastId: null,
		prefix: '#order',
		
		bindEvents: function() {

			const BCO = Boutique.Controllers.Order;
			const BU = Boutique.Utilities;

			BU.initSegmentSelect(BCO.dialog);
			BU.initSearchForm(BCO.formList, BCO.index);
			
			$(BCO.prefix + '_table, ' + BCO.prefix + '_show').off('click').on('click', function(e) {

				BCO.show(e);

			});
			
			$(BCO.prefix + '_add').off('click').on('click', function() {
				
				BCO.save(this);
				
			});

			$(BCO.prefix + '_upd').off('click').on('click', function() {
				
				BCO.save(this);
				
			});

			$(BCO.prefix + '_del').off('click').on('click', function() {
				
				BCO.remove(this);
				
			});

		},
		
		delete: function(id) {

			const BCO = Boutique.Controllers.Order;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			
			if (id) {
			
				$.ajax({
					type: 'delete',
					url: API_PATH + '/orders/' + id,
					data: BCO.formWrite.cerealize(),
					beforeSend: function() {
						BM.progress(BS.t('messageDeleting'), BCO.block);
					},
					success: function(data, status, xhr) {
						BCO.set(data, status, xhr);
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCO.block);
					}
				});
				return false;
			}

		},
		
		duplicate: function() {
			
			const BCO = Boutique.Controllers.Order;
						
			BCO.itemId = null;
			$(BCO.formWrite).find('#id').val('');
			
		},
		
		edit: function(callback) {
			
			const BCO = Boutique.Controllers.Order;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;


			if (BCO.itemId) {

				$.ajax({
					type: 'get',
					url: API_PATH + '/orders/' + BCO.itemId,
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCO.block);
					},
					success: function(data, status, xhr) {
						BCO.formWrite.decerealize(data);
						BM.hide(BCO.block);
						
						BCO.lastId = BCO.itemId;
						
						if (typeof (callback || undefined) === 'function') {
							callback.call();
						}
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCO.block);
					}
				});
			}
			
		},
		
		hide: function() {
			
			const BCO = Boutique.Controllers.Order;
			
			BCO.dialog.modal('hide');

		},

		index: function() {
			
			const BCO = Boutique.Controllers.Order;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;

			BCO.block = $('body');

			$.ajax({
				type: 'get',
				url: API_PATH + '/orders',
				data: BCO.formList.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageLoading'), BCO.block);
				},
				success: function(data, status, xhr) {
					BCO.formList.find('[data-async]').html(data);		
					BCO.bindEvents();
					BM.hide(BCO.block);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCO.block);
				}
			});
			
		},

		init: function() {

			const BCO = Boutique.Controllers.Order;
			
			BCO.dialog = $(BCO.prefix + '_dialog');
			BCO.formList = $(BCO.prefix + '_form_list');
			BCO.formWrite = $(BCO.prefix + '_form_write');
			
			BCO.action = null;
			BCO.hide();
			BCO.bindEvents();

			if (PAGE === 'orders') {
				BCO.index();
			}
			
		},

		remove: function(o) {

			const BCO = Boutique.Controllers.Order;
			const BS = Boutique.Settings;
			
			let id = (BCO.itemId) ? BCO.itemId : $(o).closest('[data-id]').data('id');
			
			if (id) {
			
				BCO.block = ($(BCO.prefix + '_dialog:visible').length) ? BCO.dialog.find('.modal-content') : $('body');
				
				bootbox.confirm({
					title: 'Confirm',
					message: '<p class="center">' + BS.t('messageConfirmDelete') + '</p>',
					callback: function(ok) {
						if (ok) {
							BCO.delete(id);
						}
					}
				});
				return false;
			}
			
		},

		reset: function() {

			const BCO = Boutique.Controllers.Order;
			const BV = Boutique.Validator;
			
			/* Reset all visible fields */
			if (BCO.formWrite.length) {
				BCO.formWrite.get(0).reset();
				BV.clearErrors(BCO.formWrite);
			}
			
			/* Reset hidden id field manually since reset doesn't clear hidden fields */
			$(BCO.prefix + '_id').val('');
				
			if (BCO.action === 'view') {
				BCO.dialog.find('.form-control').alterClass('form-control', 'form-control-plaintext').prop('readonly', true);
				BCO.dialog.find('[data-bs-dismiss="modal"]').addClass('btn-last');
			}
			else {
				BCO.formWrite.find('.form-control-plaintext').alterClass('form-control-plaintext', 'form-control').prop('readonly', false);
				BCO.dialog.find('[data-bs-dismiss="modal"]').removeClass('btn-last');
			}

		},
		
		// saves/updates an item back to the database
		save: function() {
			
			const BCO = Boutique.Controllers.Order;
			const OU = Boutique.Utilities;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			const BV = Boutique.Validator;
	
			let id = (BCO.itemId && BCO.action === 'edit') ? '/' + BCO.itemId : '';
			
			BCO.bv = BV.build(BCO.formWrite);
			
			if (BCO.bv.hasErrors()) {
				return false;
			}
		
			BV.clearErrors(BCO.formWrite);
	
			$.ajax({
				type: (BCO.action === 'edit') ? 'put' : 'post',
				url: API_PATH + '/orders' + id,
				data: BCO.formWrite.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageSaving'), BCO.block);
				},
				success: function(data, status, xhr) {
					BCO.set(data, status, xhr);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCO.block);
				}
			});
	
		},
		
		set: function(data, status, xhr) {
			
			const BCO = Boutique.Controllers.Order;
			const BM = Boutique.Messages;
	
			BM.response(data, status, xhr, BCO.block, BCO.init);
				
		},
				
		show: function(e) { 
		
			const BCO = Boutique.Controllers.Order;
			
			BCO.action = (e && e.target && e.target.dataset['action']);

			let add = $(BCO.prefix + '_add');
			let upd = $(BCO.prefix + '_upd');
			let del = $(BCO.prefix + '_del');
			
			if (BCO.action) {

				BCO.reset();

				BCO.block = BCO.dialog.find('.modal-content');
				BCO.itemId = (e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				$(add).add(upd).add(del).hide();

				// Edit/Copy/View existing item
				if (BCO.itemId) {
					if (BCO.action === 'edit') {
						upd.show();
						del.show();
					}
					else if (BCO.action === 'copy') {
						add.show();
					}
				}
				// Add new item
				else {
					add.show();
				}

				BCO.dialog.modal('show');
				BCO.dialog.off('shown.bs.modal').on('shown.bs.modal', function() {
					
					if (BCO.action.match(/(edit|view)/i)) {
						BCO.edit();
					}
					else if (BCO.action === 'copy') {
						BCO.edit(BCO.duplicate);
					}
					
				});		

			}
		},

	};

	$(function() {
		Boutique.Controllers.Order.init();
	});       

})();

