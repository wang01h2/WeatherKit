# WeatherKit

客户端模块模板支持拦截 WeatherKit v2 和 v3 天气响应，v3 处理逻辑集成在 `scripts/response.bundle.js` 中，无需单独的 v3 补丁。生成并发布模块及脚本后，需更新客户端模块；模板引用的 GitHub 分支地址只有在相应文件发布后才能使用。

v3 与 v2 使用相同的数据集处理逻辑，包括空气质量、下一小时降水和天气预警。v3 字段兼容性和实际设备表现尚未验证，如果出现天气数据缺失或错误，请停用模块。服务器 URL Rewrite 模块仍只支持 v2。

当前仓库缺少 `src/class/WeatherKit2.mjs`、`src/process/Request.mjs` 等源码和部分构建依赖，无法从现有源码重新构建完整插件。集成的脚本沿用原 v3 实验补丁，基于上游 v3.3.2 bundle 修改；要验证 v3 数据集，需恢复完整源码，并使用真实 v3 FlatBuffer 响应验证解码和重新编码。
