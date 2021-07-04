var extraImageCount = 0;
dropDownBrands = $("#brand");
dropDownCategories = $("#category");

$(document).ready(function(){
	$("#shortDescription").richText();
	$("#fullDescription").richText();
	
	dropDownBrands.change(function(){
		dropDownCategories.empty();
		getCategories();
	});
	getCategories();
	
	$("input[name='extraImage']").each(function(index){
		extraImageCount++;
		$(this).change(function(){			
			showExtraImageThumbnail(this, index);
		});
	});
	
});

function showExtraImageThumbnail(fileInput, index) {
	var file = fileInput.files[0];
	var reader = new FileReader();
	reader.onload = function(e) {
		$("#extraThumbnail" + index).attr("src", e.target.result);
	};

	reader.readAsDataURL(file);
	
	if(index >= extraImageCount - 1){
		addNextExtraImageSection(index + 1);
	}
	
}

function addNextExtraImageSection(index){
	htmlExtraImage = `
		<div class="col border m-3 p-2" id="divExtraImage${index}">
			<div id="extraImageHeader${index}"><label>Extra Image #${index + 1}:</label></div>
			<div class="m-2">
				<img id="extraThumbnail${index}" alt="Extra image #${index + 1} preview" class="img-fluid" 
				src="${defaultImageThumbnailSrc}"/>
			</div>
			<div>
				<input type="file" name="extraImage" onchange = "showExtraImageThumbnail(this, ${index})" accept="image/png, image/jpeg" />
			</div>
		</div>
	`;
	
	htmlLinkRemove = `
			<a class="btn fas fa-times-circle fa-2x icon-dark float-right" 
				href="javascript:removeExtraImage(${index - 1})"
				title="Remove this Image"></a>
	`;
	
	$("#divProductImages").append(htmlExtraImage);
	
	$("#extraImageHeader" + (index - 1)).append(htmlLinkRemove);
	
	extraImageCount++;
}

function removeExtraImage(index){
	$("#divExtraImage" + index).remove();
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
	
	url = "[[@{/products/check_unique}]]"
	
	params = {id: productId, name: productName, _csrf: csrfValue};
	
	$.post(url, params, function(response){
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