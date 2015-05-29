namespace :db do
  desc "drop create migrate prepare seed"
  task :dcmps do
    puts " --- Dropping database --- "
    Rake::Task['db:drop'].invoke
    puts " --- Creating database --- "
    Rake::Task['db:create'].invoke
    puts " --- Migrating --- "
    Rake::Task['db:migrate'].invoke
    puts " --- Preparing test database --- "
    Rake::Task['db:test:prepare'].invoke
    puts " --- Seeding database --- "
    Rake::Task['db:seed'].invoke
  end
end
