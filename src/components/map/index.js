import './index.less'

$(function(){
	var map = new BMap.Map("allmap");
    window.map = map;
    var point = new BMap.Point(121.430947,31.194621);
    var marker=new BMap.Marker(point);
    map.addOverlay(marker); 
    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
    map.centerAndZoom(point, 19); 
    map.setCurrentCity("嘉兴"); 
    map.addControl(new BMap.MapTypeControl());  
    map.disableScrollWheelZoom(true);   
    map.addControl(new BMap.NavigationControl());           
    map.addControl(new BMap.ScaleControl());                  
    map.addControl(new BMap.OverviewMapControl());         
    map.disable3DBuilding();
    map.setMapStyle({style:'grayscale'});
	
	$('.list-wrap li').click(function(){
		var gps = $(this).data('gps').split(',');
		var point = new BMap.Point(gps[0],gps[1]);
		map.centerAndZoom(point,19);
		if(!$(this).data('have')){
			var marker=new BMap.Marker(point);
		    map.addOverlay(marker); 
		    marker.setAnimation(BMAP_ANIMATION_BOUNCE);
		    $(this).data('have',1);
		}
	})
})

