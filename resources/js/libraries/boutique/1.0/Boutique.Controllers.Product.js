; (function() {

    'use strict';
	
	Boutique.Controllers.Product = {
		
		block: null,
		prefix: '#product',
		
		bindEvents: function() {

			const BCP = Boutique.Controllers.Product;
			
			$(BCP.prefix + '-list').off('click').on('click', function(e) {

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
		
		delete: function(id) {

		},
		
		edit: function(callback) {
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;

			if (BCP.itemId) {

				$.ajax({
					type: 'get',
					url: '/products/' + BCP.itemId,
					beforeSend: function() {
						BM.progress(BS.t('messageLoading'), BCP.block);
					},
					success: function(data, status, xhr) {
						BCP.formWrite.decerealize(data);
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
			
		},

		index: function() {
			
		},

		init: function() {

			const BCP = Boutique.Controllers.Product;
			
			BCP.dialog = $(BCP.prefix + '_dialog');
			BCP.formWrite = $(BCP.prefix + '_form_write');
			
			BCP.bindEvents();
			
		},

		remove: function(o) {

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
				
		},
		
		// saves/updates an item back to the database
		save: function() {
			
			const BCP = Boutique.Controllers.Product;
			const OU = Boutique.Utilities;
			const BM = Boutique.Messages;
			const BS = Boutique.Settings;
			const BV = Boutique.Validator;
	
			let id = (BCP.itemId) ? '/' + BCP.itemId : '';
			BCP.bv = BV.build(BCP.formWrite);
			
			if (BCP.bv.hasErrors()) {
				return false;
			}
		
			BV.clearErrors(BCP.formWrite);
			console.log(id);
	
			$.ajax({
				type: 'post',
				url: '/products' + id,
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
			
			const BCP = Boutique.Controllers.Product;
			const BM = Boutique.Messages;
	
			//BM.response(data, status, xhr, BCP.block, BCP.hide);
			BM.response(data, status, xhr, BCP.block, BCP.init);
				
		},
				
		show: function(e) { 
		
			const BCP = Boutique.Controllers.Product;
			const show = (e && e.target && e.target.dataset['bsShow']);
			console.log(e, e.target, e.target.dataset);
			
			if (show) {

				BCP.block = BCP.dialog.find('.modal-content');
				BCP.itemId = (e.target.dataset['id']) ? e.target.dataset['id'] : false;
				
				if (BCP.itemId) {
					$(BCP.prefix + '_add').hide();	
					$(BCP.prefix + '_del, ' + BCP.prefix + '_upd').show();	
				}
				else {
					$(BCP.prefix + '_add').show();	
					$(BCP.prefix + '_del, ' + BCP.prefix + '_upd').hide();	
					BCP.reset();	
				}

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

