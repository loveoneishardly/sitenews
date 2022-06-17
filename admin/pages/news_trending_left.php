<div class="card-header">
	<h4 class="card-title">Danh sách slide</h4>
</div>
<div class="card-body">
	<div class="table-responsive">
		<table id="datatables" class="cell-border table table-hover" style="width:100%">
			<thead>
				<tr>
					<th>STT</th>
					<th>Title</th>
					<th>Mô tả</th>
					<th>Rút gọn</th>
					<th>Loại</th>
					<th>Time</th>
					<th>Tác giả</th>
					<th>Sắp xếp</th>
					<th>Action</th>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
	</div>
</div>
<script type="text/javascript">
	$(document).ready(function () {
		loadData();
		var t = $('#datatables').removeAttr('width').DataTable({
			"pageLength": 10,
			"autoWidth": false,
			"order": [[ 1, 'asc' ]],
			"columnDefs": [ /*Set width of column dataTables*/
	        	{ "width": "5%", "targets": 0 },
	        	{ "width": "15%", "targets": 1 },
	        	{ "width": "12%", "targets": 2 },
	        	{ "width": "12%", "targets": 5 },
	        	{ "width": "15%", "targets": -1, "data": null, "defaultContent": '<button type="button" data-toggle="tooltip" title="Sửa" class="btn btn-link btn-primary btn-lg" data-original-title="Sửa" onclick="fSuadulieu()"><i class="fa fa-edit"></i></button><button name= "delete" id="delete" type="button" data-toggle="tooltip" title="Xóa" class="btn btn-link btn-danger" data-original-title="Xóa" onclick="fXoadulieu()"><i class="fa fa-times"></i></button>'}
	        ]
		});
	 
	    t.on( 'order.dt search.dt', function () {
	        t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
	            cell.innerHTML = i+1;
	        } );
	    } ).draw();
	});

	function loadData() {
		$.ajax({
          	type: 'POST',
          	url: 'go',
          	data: {
              	for: "loadnews_trendingleft",
              	typenews: '1',
	            madonvi: <?php echo $_SESSION["madonvi"]; ?>
          	}
        }).done(function(data){
        	var j_data = JSON.parse(data);
        	loadDataTable(j_data);
        });
  	}
  	function loadDataTable(data) {
	    $("#datatables").DataTable().clear();
	    var length = Object.keys(data.danhsachban).length;
	    for(var i = 0; i < length; i++) {
        	var danhsachban = data.danhsachban[i];
	      	$('#datatables').dataTable().fnAddData( [
	      		"",
		        danhsachban.title,
		        danhsachban.created_at,
		        danhsachban.slug,
		        danhsachban.name,
		        danhsachban.updated_at,
		        danhsachban.name_user,
		        danhsachban.order
	      	]);
	    }
  	}
  	function fXoadulieu(){
  		var table = $('#datatables').DataTable();
  		$('#datatables tbody').on('click', 'button .delete', function () {
	       	var data = table.row($(this).closest('tr')).data();
	       	alert(data);
	       	//alert(data[Object.keys(data)[0]]+' s phone: '+data[Object.keys(data)[1]]);
	 	});
  	}
  	function fSuadulieu(){
  		/*
  		var table = $('#datatables').DataTable();
  		$('#datatables tbody').on( 'click', 'tr', function () {
  			var datarow = table.row( this ).data();
		    console.log( datarow[1]);
		});*/
  	}
</script>