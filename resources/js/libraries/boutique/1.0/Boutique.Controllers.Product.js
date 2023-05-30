; (function() {

    'use strict';
	
	Boutique.Controllers.Product = {
		
		action: null,
		block: null,
		lastId: null,
		prefix: '#product',
		
		bindEvents: function() {

			const BCP = Boutique.Controllers.Product;
			const BU = Boutique.Utilities;

			BU.initSegmentSelect(BCP.dialog);
			BU.initSearchForm(BCP.formList, BCP.index);
			
			$(BCP.prefix + '_table, ' + BCP.prefix + '_show').off('click').on('click', function(e) {

				BCP.show(e);

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

		buildDetails: function(data) {

			const BCP = Boutique.Controllers.Product;
			const BU = Boutique.Utilities;

			let nf = '<tr><td colspan="8"><h5 class="msg-no-records">No %s available for this product</h5></tr>';
			let columns = {
				orders: [
					'name',
					'street_address',
					'city',
					'state',
					'zip',
					'country_code',
					'order_status',
					'created_at',
				],
				stocks: [
					'color',
					'quantity',
					'size',
					'sku',
					'cost_cents',
					'price_cents',
					'sale_price_cents',
				]
			}
			let orders = $(BCP.prefix + '_orders_table tbody');
			let stocks = $(BCP.prefix + '_stocks_table tbody');
			let row, cell, r, c, v;
			let json = {};

			// reset previous views
			orders.html('');
			stocks.html('');

			try {
				json = JSON.parse(data);
			}
			catch(e) {}

			console.log(json);

			if (json.orders && json.orders.length) {
				for (r in json.orders) {
					row = $('<tr></tr>');
					for (c in columns.orders) {
						v = json.orders[r][columns.orders[c]];
						if (columns.orders[c] === 'created_at') {
							v = new Date(v).toLocaleDateString();
						}
						cell = $('<td><div>' + v + '</div></td>');
						row.append(cell)
					}
					orders.append(row);
				}
			}
			else {
				orders.html(sprintf(nf, 'orders'));
			}
			if (json.stocks && json.stocks.length) {
				for (r in json.stocks) {
					row = $('<tr></tr>');
					for (c in columns.stocks) {
						v = json.stocks[r][columns.stocks[c]];
						cell = $('<td><div>' + v + '</div></td>');
						row.append(cell)
					}
					stocks.append(row);
				}
			}
			else {
				stocks.html(sprintf(nf, 'stocks'));
			}

		},
		
		delete: function(id) {

			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			
			if (id) {
			
				$.ajax({
					type: 'delete',
					url: API_PATH + '/products/' + id,
					data: BCP.formWrite.cerealize(),
					beforeSend: function() {
						BM.progress(BS.t('messageDeleting'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.set(data, status, xhr);
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCP.block);
					}
				});
				return false;
			}

		},
		
		duplicate: function() {
			
			const BCP = Boutique.Controllers.Product;
						
			BCP.itemId = null;
			$(BCP.formWrite).find('#id').val('');
			
		},
		
		edit: function(callback) {
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;


			if (BCP.itemId) {

				$.ajax({
					type: 'get',
					url: API_PATH + '/products/' + BCP.itemId,
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.buildDetails(data);
						BCP.formWrite.decerealize(data);
						BM.hide(BCP.block);
						
						BCP.lastId = BCP.itemId;
						
						if (typeof (callback || undefined) === 'function') {
							callback.call();
						}
					},
					error: function(data, status, xhr) {
						BM.response(data, status, xhr, BCP.block);
					}
				});
			}
			
		},
		
		hide: function() {
			
			const BCP = Boutique.Controllers.Product;
			
			BCP.dialog.modal('hide');

		},

		index: function() {
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;

			BCP.block = $('body');

			$.ajax({
				type: 'get',
				url: API_PATH + '/products',
				data: BCP.formList.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageLoading'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.formList.find('[data-async]').html(data);		
					BCP.bindEvents();
					BM.hide(BCP.block);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCP.block);
				}
			});
			
		},

		init: function() {

			const BCP = Boutique.Controllers.Product;
			
			BCP.dialog = $(BCP.prefix + '_dialog');
			BCP.formList = $(BCP.prefix + '_form_list');
			BCP.formWrite = $(BCP.prefix + '_form_write');
			
			BCP.action = null;
			BCP.hide();
			BCP.bindEvents();

			if (PAGE === 'products') {
				BCP.index();
			}
			
		},

		remove: function(o) {

			const BCP = Boutique.Controllers.Product;
			const BS = Boutique.Settings;
			
			let id = (BCP.itemId) ? BCP.itemId : $(o).closest('[data-id]').data('id');
			
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

			const BCP = Boutique.Controllers.Product;
			const BV = Boutique.Validator;
			
			/* Reset all visible fields */
			if (BCP.formWrite.length) {
				BCP.formWrite.get(0).reset();
				BV.clearErrors(BCP.formWrite);
			}
			
			/* Reset hidden id field manually since reset doesn't clear hidden fields */
			$(BCP.prefix + '_id').val('');
				
			if (BCP.action === 'view') {
				BCP.dialog.find('.form-control').alterClass('form-control', 'form-control-plaintext').prop('readonly', true);
				BCP.dialog.find('[data-bs-dismiss="modal"]').addClass('btn-last');
			}
			else {
				BCP.formWrite.find('.form-control-plaintext').alterClass('form-control-plaintext', 'form-control').prop('readonly', false);
				BCP.dialog.find('[data-bs-dismiss="modal"]').removeClass('btn-last');
			}

		},
		
		// saves/updates an item back to the database
		save: function() {
			
			const BCP = Boutique.Controllers.Product;
			const OU = Boutique.Utilities;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			const BV = Boutique.Validator;
	
			let id = (BCP.itemId && BCP.action === 'edit') ? '/' + BCP.itemId : '';
			
			BCP.bv = BV.build(BCP.formWrite);
			
			if (BCP.bv.hasErrors()) {
				return false;
			}
		
			BV.clearErrors(BCP.formWrite);
	
			$.ajax({
				type: (BCP.action === 'edit') ? 'put' : 'post',
				url: API_PATH + '/products' + id,
				data: BCP.formWrite.cerealize(),
				beforeSend: function() {
					BM.progress(BS.t('messageSaving'), BCP.block);
				},
				success: function(data, status, xhr) {
					BCP.set(data, status, xhr);
				},
				error: function(data, status, xhr) {
					BM.response(data, status, xhr, BCP.block);
				}
			});
	
		},
		
		set: function(data, status, xhr) {
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
	
			BM.response(data, status, xhr, BCP.block, BCP.init);
				
		},
				
		show: function(e) { 
		
			const BCP = Boutique.Controllers.Product;
			
			BCP.action = (e && e.target && e.target.dataset['action']);

			let add = $(BCP.prefix + '_add');
			let upd = $(BCP.prefix + '_upd');
			let del = $(BCP.prefix + '_del');
			
			if (BCP.action) {

				BCP.reset();

				BCP.block = BCP.dialog.find('.modal-content');
				BCP.itemId = (e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				$(add).add(upd).add(del).hide();

				// Edit/Copy/View existing item
				if (BCP.itemId) {
					if (BCP.action === 'edit') {
						upd.show();
						del.show();
					}
					else if (BCP.action === 'copy') {
						add.show();
					}
				}
				// Add new item
				else {
					add.show();
				}

				BCP.dialog.modal('show');
				BCP.dialog.off('shown.bs.modal').on('shown.bs.modal', function() {
					
					if (BCP.action.match(/(edit|view)/i)) {
						BCP.edit();
					}
					else if (BCP.action === 'copy') {
						BCP.edit(BCP.duplicate);
					}
					
				});		

			}
		},

	};

	$(function() {
		Boutique.Controllers.Product.init();
	});       

})();

