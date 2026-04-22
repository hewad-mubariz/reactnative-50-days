Pod::Spec.new do |s|
  s.name           = 'BackgroundBlur'
  s.version        = '1.0.0'
  s.summary        = 'Background blur Expo module'
  s.description    = 'UIKit-backed gaussian background blur with tint overlay.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
