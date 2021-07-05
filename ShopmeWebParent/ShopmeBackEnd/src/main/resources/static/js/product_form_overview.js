dropDownBrands = $("#brand");
dropDownCategories = $("#category");

$(document).ready(function(){
	$("#shortDescription").richText();
	$("#fullDescription").richText();
	
	dropDownBrands.change(function(){
		dropDownCategories.empty();
		getCategories();
	});
	getCategoriesForNewForm();
});

function getCategoriesForNewForm(){
	catIdField = $("#categoryId");
	editMode = false;
	if(catIdField.length){
		editMode = true;
	}
	
	if(!editMode) getCategories();
}

function getCategories(){
	brandId = dropDownBrands.val();
	url = brandModuleURL + '/' + brandId + '/categories';
	$.get(url, function(response) {
		$.each(response, function(index, category){
			$("<option>").val(category.id).text(category.name).appendTo(dropDownCategories);
		});
	});
}

function checkUnique(form){
	productId = $("#id").val();
	productName = $("#name").val();
	
	csrfValue = $("input[name='_csrf']").val();
	
	params = {id: productId, name: productName, _csrf: csrfValue};
	
	$.post(checkUniqueUrl, params, function(response){
		if(response == "OK"){
			form.submit();
		}else if (response == "Duplicate"){
			showWarningModal("There is another product having same name " + productName);
		}else{
			showErrorModal("Unknown response from server");
		}
	}).fail(function(){
		showErrorModal("Could not connect to the server");
	});
	return false;
}