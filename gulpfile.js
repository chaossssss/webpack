var gulp = require('gulp');
var rename = require("gulp-rename");
var replace = require('gulp-replace');
var config = require('./config/config.js');


//初始化项目目录
gulp.task('initProject',function(){
	config.pages.forEach(function(page){
		gulp.src('config/template/index.*')
		.pipe(rename(function (path) {
		    path.dirname = page;
		  }))
		.pipe(replace(/(class="body")|(.body)/g,function($1){
			if($1 === 'class="body"'){
				return 'class="'+page+'-body"';
			}else if($1 === '.body'){
				return '.'+page+'-body';
			}
		}))
		.pipe(gulp.dest('src/page'))
	})
})

//默认任务启动
gulp.task('default', ['initProject']);


