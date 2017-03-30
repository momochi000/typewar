namespace :assets do
  task :precompile do
    Rake::Task['assets:precompile'].enhance do
      system('bundle exec ./bin/yarn')
      system('bundle exec rails webpacker:compile')
    end
  end
end
