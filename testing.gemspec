# $LOAD_PATH.push File.expand_path('../lib', __FILE__)

Gem::Specification.new do |gem|
  gem.name          = 'testing'
  gem.version = '1'
  gem.authors       = ['Garen Torikian']
  gem.email         = ['gjtorikian@gmail.com']
  gem.description   = 'Just a test.'
  gem.summary       = 'This is me goofing off.'
  gem.license       = 'MIT'
  all_files         = `git ls-files -z`.split("\x0")
  gem.files         = all_files.grep(%r{^(bin|lib)/})
  gem.executables   = all_files.grep(%r{^bin/}) { |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(spec)/})
  gem.require_paths = ['lib']

  gem.add_dependency 'colorize',        '~> 0.8'
  gem.add_development_dependency 'rake'
end
