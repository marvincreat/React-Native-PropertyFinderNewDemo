/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  UIView *nativeRootView = [[UIView alloc] initWithFrame:[UIScreen mainScreen].bounds];
  nativeRootView.backgroundColor = [UIColor lightGrayColor];
  
  UIButton *nativeButton = [UIButton buttonWithType:UIButtonTypeCustom];
  [nativeButton setFrame:CGRectMake(100, 100, 100, 200)];
  nativeButton.backgroundColor = [UIColor orangeColor];
  [nativeButton setTitle:@"Click here" forState:UIControlStateNormal];
  [nativeButton addTarget:self action:@selector(nativeButton) forControlEvents:UIControlEventTouchUpInside];
  [nativeRootView addSubview:nativeButton];
  
  
  
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = nativeRootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (void)nativeButton
{
//  NSURL *jsCodeLocation;
//  jsCodeLocation = [RCTBundleURLProvider jsBundleURLForBundleRoot:@"index.ios" packagerHost:@"172.16.12.106" enableDev:YES enableMinification:YES ];
  
  
  
  NSURL *jsCodeLocation;
  
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"PropertyFinder"
                                               initialProperties:nil
                                                   launchOptions:nil];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;

  
  [self.window.rootViewController presentViewController:rootViewController animated:YES completion:nil];

}

@end
