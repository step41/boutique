; (function() {

    'use strict';
	
	Boutique.Controllers.Stock = {
		
		action: null,
		block: null,
		lastId: null,
		prefix: '#stock',
		
		bindEvents: function() {

			const BCS = Boutique.Controllers.Stock;
			const BU = Boutique.Utilities;

			BU.initSearchForm(BCS.formList, BCS.index);
			
			$(BCS.prefix + '_table, ' + BCS.prefix + '_show').off('click').on('click', function(e) {

				BCS.show(e);

			});
			
			$(BCS.prefix + '_add').off('click').on('click', function() {
				
				BCS.save(this);
				
			});

			$(BCS.prefix + '_upd').off('click').on('click', function() {
				
				BCS.save(this);
				
			});

			$(BCS.prefix + '_del').off('click').on('click', function() {
				
				BCS.remove(this);
				
			});

		},
		
		delete: function(id) {

			const BCS = Boutique.Controllers.Stock;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			
			if (id) {
			
				$.ajax({
					type: 'delete',
					url: API_PATH + '/stocks/' + id,
					data: BCS.formWrite.cerealize(),
					beforeSend: function() {
						BM.progress(BS.t('messageDeleting'), BCS.block);
					},
					success: function(data, status, xhr) {
						BCS.set(data, status, xhr);
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCS.block);
					}
				});
				return false;
			}

		},
		
		duplicate: function() {
			
			const BCS = Boutique.Controllers.Stock;
						
			BCS.itemId = null;
			$(BCS.formWrite).find('#id').val('');
			
		},
		
		edit: function(callback) {
			
			const BCS = Boutique.Controllers.Stock;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;


			if (BCS.itemId) {

				$.ajax({
					type: 'get',
					url: API_PATH + '/stocks/' + BCS.itemId,
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCS.block);
					},
					success: function(data, status, xhr) {
						BCS.formWrite.decerealize(data);
						BM.hide(BCS.block);
						
						BCS.lastId = BCS.itemId;
						
						if (typeof (callback || undefined) === 'function') {
							callback.call();
						}
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCS.block);
					}
				});
			}
			
		},
		
		hide: function() {
			
			const BCS = Boutique.Controllers.Stock;
			
			BCS.dialog.modal('hide');

		},

		index: function() {
			
			const BCS = Boutique.Controllers.Stock;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;

			BCS.block = $('body');

			$.ajax({
				type: 'get',
				url: API_PATH + '/stocks',
				data: BCS.formList.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageLoading'), BCS.block);
				},
				success: function(data, status, xhr) {
					BCS.formList.find('[data-async]').html(data);		
					BCS.bindEvents();
					BM.hide(BCS.block);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCS.block);
				}
			});
			
		},

		init: function() {

			const BCS = Boutique.Controllers.Stock;
			
			BCS.dialog = $(BCS.prefix + '_dialog');
			BCS.formList = $(BCS.prefix + '_form_list');
			BCS.formWrite = $(BCS.prefix + '_form_write');
			
			BCS.action = null;
			BCS.hide();
			BCS.bindEvents();

			if (PAGE === 'stocks') {
				BCS.index();
			}
			
		},

		remove: function(o) {

			const BCS = Boutique.Controllers.Stock;
			const BS = Boutique.Settings;
			
			let id = (BCS.itemId) ? BCS.itemId : $(o).closest('[data-id]').data('id');
			
			if (id) {
			
				BCS.block = ($(BCS.prefix + '_dialog:visible').length) ? BCS.dialog.find('.modal-content') : $('body');
				
				bootbox.confirm({
					title: 'Confirm',
					message: '<p class="center">' + BS.t('messageConfirmDelete') + '</p>',
					callback: function(ok) {
						if (ok) {
							BCS.delete(id);
						}
					}
				});
				return false;
			}
			
		},

		reset: function() {

			const BCS = Boutique.Controllers.Stock;
			const BV = Boutique.Validator;
			
			/* Reset all visible fields */
			if (BCS.formWrite.length) {
				BCS.formWrite.get(0).reset();
				BV.clearErrors(BCS.formWrite);
			}
			
			/* Reset hidden id field manually since reset doesn't clear hidden fields */
			$(BCS.prefix + '_id').val('');
				
			if (BCS.action === 'view') {
				BCS.dialog.find('.form-control').alterClass('form-control', 'form-control-plaintext').prop('readonly', true);
				BCS.dialog.find('[data-bs-dismiss="modal"]').addClass('btn-last');
			}
			else {
				BCS.formWrite.find('.form-control-plaintext').alterClass('form-control-plaintext', 'form-control').prop('readonly', false);
				BCS.dialog.find('[data-bs-dismiss="modal"]').removeClass('btn-last');
			}

		},
		
		// saves/updates an item back to the database
		save: function() {
			
			const BCS = Boutique.Controllers.Stock;
			const OU = Boutique.Utilities;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			const BV = Boutique.Validator;
	
			let id = (BCS.itemId && BCS.action === 'edit') ? '/' + BCS.itemId : '';
			
			BCS.bv = BV.build(BCS.formWrite);
			
			if (BCS.bv.hasErrors()) {
				return false;
			}
		
			BV.clearErrors(BCS.formWrite);
	
			$.ajax({
				type: (BCS.action === 'edit') ? 'put' : 'post',
				url: API_PATH + '/stocks' + id,
				data: BCS.formWrite.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageSaving'), BCS.block);
				},
				success: function(data, status, xhr) {
					BCS.set(data, status, xhr);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCS.block);
				}
			});
	
		},
		
		set: function(data, status, xhr) {
			
			const BCS = Boutique.Controllers.Stock;
			const BM = Boutique.Messages;
	
			BM.response(data, status, xhr, BCS.block, BCS.init);
				
		},
				
		show: function(e) { 
		
			const BCS = Boutique.Controllers.Stock;
			
			BCS.action = (e && e.target && e.target.dataset['action']);

			let add = $(BCS.prefix + '_add');
			let upd = $(BCS.prefix + '_upd');
			let del = $(BCS.prefix + '_del');
			
			if (BCS.action) {

				BCS.reset();

				BCS.block = BCS.dialog.find('.modal-content');
				BCS.itemId = (e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				$(add).add(upd).add(del).hide();

				// Edit/Copy/View existing item
				if (BCS.itemId) {
					if (BCS.action === 'edit') {
						upd.show();
						del.show();
					}
					else if (BCS.action === 'copy') {
						add.show();
					}
				}
				// Add new item
				else {
					add.show();
				}

				BCS.dialog.modal('show');
				BCS.dialog.off('shown.bs.modal').on('shown.bs.modal', function() {
					
					if (BCS.action.match(/(edit|view)/i)) {
						BCS.edit();
					}
					else if (BCS.action === 'copy') {
						BCS.edit(BCS.duplicate);
					}
					
				});		

			}
		},

	};

	$(function() {
		Boutique.Controllers.Stock.init();
	});       

})();

