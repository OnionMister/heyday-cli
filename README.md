在使用`lerna crete 包名` 增加包后，需要将包下package.json中增加`"publishConfig": { "access": "public" }`以设为公有的，默认为private。在执行`lerna publish`布时私有包不会被发布。