module.exports = function(grunt) {
  grunt.initConfig({
    babel: {
      scripts: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.js',
          dest: 'build/'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['clean', 'babel']
      }
    },
		clean: {
			scripts: ['build']
		}
  });

  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['clean', 'babel']);
};
