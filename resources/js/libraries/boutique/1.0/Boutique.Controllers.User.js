; (function() {

    'use strict';
	
	Boutique.Controllers.User = {
		
		action: null,
		block: null,
		lastId: null,
		prefix: '#user',
		
		bindEvents: function() {

			const BCU = Boutique.Controllers.User;
			const BU = Boutique.Utilities;

			BU.initSegmentSelect(BCU.dialog);
			BU.initSearchForm(BCU.formList, BCU.index);
			
			$(BCU.prefix + '_table, ' + BCU.prefix + '_show').off('click').on('click', function(e) {

				BCU.show(e);

			});
			
			$(BCU.prefix + '_add').off('click').on('click', function() {
				
				BCU.save(this);
				
			});

			$(BCU.prefix + '_upd').off('click').on('click', function() {
				
				BCU.save(this);
				
			});

			$(BCU.prefix + '_del').off('click').on('click', function() {
				
				BCU.remove(this);
				
			});

		},

		delete: function(id) {

			const BCU = Boutique.Controllers.User;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			
			if (id) {
			
				$.ajax({
					type: 'delete',
					url: API_PATH + '/users/' + id,
					data: BCU.formWrite.cerealize(),
					beforeSend: function() {
						BM.progress(BS.t('messageDeleting'), BCU.block);
					},
					success: function(data, status, xhr) {
						BCU.set(data, status, xhr);
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCU.block);
					}
				});
				return false;
			}

		},
		
		duplicate: function() {
			
			const BCU = Boutique.Controllers.User;
						
			BCU.itemId = null;
			$(BCU.formWrite).find('#id').val('');
			
		},
		
		edit: function(callback) {
			
			const BCU = Boutique.Controllers.User;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;


			if (BCU.itemId) {

				$.ajax({
					type: 'get',
					url: API_PATH + '/users/' + BCU.itemId,
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCU.block);
					},
					success: function(data, status, xhr) {
						BCU.formWrite.decerealize(data);
						if ($('[name="id"]').val() == $('[data-active-user-id]').data('activeUserId')) {
							BCU.dialog.find('[name="role_id"]').prop('readonly', true).prop('disabled', true);
						}
						BM.hide(BCU.block);
						
						BCU.lastId = BCU.itemId;
						
						if (typeof (callback || undefined) === 'function') {
							callback.call();
						}
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCU.block);
					}
				});
			}
			
		},
		
		hide: function() {
			
			const BCU = Boutique.Controllers.User;
			
			BCU.dialog.modal('hide');

		},

		index: function() {
			
			const BCU = Boutique.Controllers.User;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;

			BCU.block = $('body');

			$.ajax({
				type: 'get',
				url: API_PATH + '/users',
				data: BCU.formList.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageLoading'), BCU.block);
				},
				success: function(data, status, xhr) {
					BCU.formList.find('[data-async]').html(data);		
					BCU.bindEvents();
					BM.hide(BCU.block);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCU.block);
				}
			});
			
		},

		init: function() {

			const BCU = Boutique.Controllers.User;
			
			BCU.dialog = $(BCU.prefix + '_dialog');
			BCU.formList = $(BCU.prefix + '_form_list');
			BCU.formWrite = $(BCU.prefix + '_form_write');
			
			BCU.action = null;
			BCU.hide();
			BCU.bindEvents();

			if (PAGE === 'users') {
				BCU.index();
			}
			
		},

		remove: function(o) {

			const BCU = Boutique.Controllers.User;
			const BS = Boutique.Settings;
			
			let id = (BCU.itemId) ? BCU.itemId : $(o).closest('[data-id]').data('id');
			
			if (id) {
			
				BCU.block = ($(BCU.prefix + '_dialog:visible').length) ? BCU.dialog.find('.modal-content') : $('body');
				
				bootbox.confirm({
					title: 'Confirm',
					message: '<p class="center">' + BS.t('messageConfirmDelete') + '</p>',
					callback: function(ok) {
						if (ok) {
							BCU.delete(id);
						}
					}
				});
				return false;
			}
			
		},

		reset: function() {

			const BCU = Boutique.Controllers.User;
			const BV = Boutique.Validator;
			
			/* Reset all visible fields */
			if (BCU.formWrite.length) {
				BCU.formWrite.get(0).reset();
				BV.clearErrors(BCU.formWrite);
			}
			
			/* Reset hidden id field manually since reset doesn't clear hidden fields */
			$(BCU.prefix + '_id').val('');
				
			if (BCU.action === 'view') {
				BCU.dialog.find('select').alterClass('form-select', 'form-control-plaintext').prop('readonly', true).prop('disabled', true);
				BCU.dialog.find('.form-control').alterClass('form-control', 'form-control-plaintext').prop('readonly', true).prop('disabled', true);
				BCU.dialog.find('[data-bs-dismiss="modal"]').addClass('btn-last');
			}
			else {
				BCU.formWrite.find('select').alterClass('form-control-plaintext', 'form-select').prop('readonly', false).prop('disabled', false);
				BCU.formWrite.find('.form-control-plaintext:not(select)').alterClass('form-control-plaintext', 'form-control').prop('readonly', false).prop('disabled', false);
				BCU.dialog.find('[data-bs-dismiss="modal"]').removeClass('btn-last');
			}

		},
		
		// saves/updates an item back to the database
		save: function() {
			
			const BCU = Boutique.Controllers.User;
			const OU = Boutique.Utilities;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			const BV = Boutique.Validator;
	
			let id = (BCU.itemId && BCU.action === 'edit') ? '/' + BCU.itemId : '';
			
			BCU.bv = BV.build(BCU.formWrite);
			
			if (BCU.bv.hasErrors()) {
				return false;
			}
		
			BV.clearErrors(BCU.formWrite);
	
			$.ajax({
				type: (BCU.action === 'edit') ? 'put' : 'post',
				url: API_PATH + '/users' + id,
				data: BCU.formWrite.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageSaving'), BCU.block);
				},
				success: function(data, status, xhr) {
					BCU.set(data, status, xhr);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCU.block);
				}
			});
	
		},
		
		set: function(data, status, xhr) {
			
			const BCU = Boutique.Controllers.User;
			const BM = Boutique.Messages;
	
			BM.response(data, status, xhr, BCU.block, BCU.init);
				
		},
				
		show: function(e) { 
		
			const BCU = Boutique.Controllers.User;
			
			BCU.action = (e && e.target && e.target.dataset['action']);

			let add = $(BCU.prefix + '_add');
			let upd = $(BCU.prefix + '_upd');
			let del = $(BCU.prefix + '_del');
			
			if (BCU.action) {

				BCU.reset();

				BCU.block = BCU.dialog.find('.modal-content');
				BCU.itemId = (e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				$(add).add(upd).add(del).hide();

				// Edit/Copy/View existing item
				if (BCU.itemId) {
					if (BCU.action === 'edit') {
						upd.show();
						del.show();
					}
					else if (BCU.action === 'copy') {
						add.show();
					}
				}
				// Add new item
				else {
					add.show();
				}

				BCU.dialog.modal('show');
				BCU.dialog.off('shown.bs.modal').on('shown.bs.modal', function() {
					
					if (BCU.action.match(/(edit|view)/i)) {
						BCU.edit();
					}
					else if (BCU.action === 'copy') {
						BCU.edit(BCU.duplicate);
					}
					
				});		

			}
		},

	};

	$(function() {
		Boutique.Controllers.User.init();
	});       

})();

