Rake::Task['assets:precompile'].enhance do
  system('bundle exec ./bin/yarn')
  system('bundle exec rails webpacker:compile')
end

# namespace :assets do
#   task :precompile do
#     Rake::Task['assets:precompile'].enhance do
#       system('bundle exec ./bin/yarn')
#       system('bundle exec rails webpacker:compile')
#     end
#   end
# end

# assets.rake
# Rake::Task["assets:precompile"]
#   .clear_prerequisites
#   .enhance(["assets:compile_environment"])
# 
# namespace :assets do
#   task compile_environment: [:yarn, :webpack] do
#     Rake::Task["assets:environment"].invoke
#   end
# 
#   desc "Install node deps via yarn"
# 
#   task :yarn do
#     sh "bundle exec ./bin/yarn"
#   end
# 
#   task :webpack do
#     sh "bundle exec rails webpacker:compile"
#   end
# end
