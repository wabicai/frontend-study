> 对 axios 进行封装

1. 定义 HTTP 请求头基类

```ts
export class THttpResponse {
	public code = 0;
	public headers: { [key: string]: string } = {};
	public data = "";

	constructor(code: number, headers: { [key: string]: string }, data: string) {
		this.code = code;
		this.headers = headers;
		this.data = data;
	}
}
// HTTP统计
export class THttpStatistics {
	public requestTimes = 0; // 请求次数（不含重试）
	public requestTimesSucceed = 0; // 请求成功次数
	public requestTimesFailed = 0; // 请求失败次数（不含重试）
	public requestTimesTotal = 0; // 请求总次数（含重试）
	public requestTimesTotalFailed = 0; // 请求失败总次数（含重试）
	public responseTimes: { [key: number]: number } = {};
}
```

2. request 类

```ts
export class TRequest {
	public httpRequest(
		method: Method,
		url: string,
		headers: { [key: string]: string } = {},
		content = "",
		progressCallback: THttpProgressCallback = null,
		retryTimes = 3
	): Promise<THttpResponse> {
		return new Promise((resolve, reject) => {
			let retryNumber = 0;
			const axiosInstance = axios.create({
				responseType: "json",
				onUploadProgress(e) {
					progressCallback &&
						progressCallback(THttpAction.Request, e.loaded, e.total);
				},
				onDownloadProgress(e) {
					progressCallback &&
						progressCallback(THttpAction.Response, e.loaded, e.total);
				},
				validateStatus(status) {
					return status >= 200 && status < 300; // 只有2XX返回成功，其它响应走catch逻辑打印信息
				},
			});
			const applyRequest = () => {
				pathStatistics.requestTimesTotal += 1;
				const requestTime = window.performance.now();
				axiosInstance
					.request({
						method,
						url,
						headers,
						data: content,
						timeout: 100000,
					})
					.then(
						(resp) => {
							pathStatistics.requestTimesSucceed += 1;
							increaseResponseTimes(resp.status);
							resolve(
								new THttpResponse(
									resp.status,
									resp.headers,
									typeof resp.data === "string"
										? resp.data
										: JSON.stringify(resp.data)
								)
							);
						},
						(err) => {
							pathStatistics.requestTimesTotalFailed += 1;
							if (err.response) {
								increaseResponseTimes(err.response.status);
							} else if (err.request) {
								increaseResponseTimes(-1);
							} else {
								increaseResponseTimes(-2);
							}
							retryNumber += 1;
							const errorInfo = `TCIC http request failed ${retryNumber}/${retryTimes} -> ${Math.ceil(
								window.performance.now() - requestTime
							)}ms`;
							if (
								retryNumber < retryTimes &&
								TRequest._isNetworkOrRetryableError(err)
							) {
								const delay = TRequest._getExponentialDelay(retryNumber); // 计算延迟请求时间
								console.warn(
									`${errorInfo}, retry after ${Math.ceil(delay)}ms`,
									JSON.stringify(err)
								);
								setTimeout(applyRequest, delay); // 延迟发起重试请求
								return;
							}
							pathStatistics.requestTimesFailed += 1;
							if (err.response) {
								// 有收到回包，只是状态码不符合预期
								let msg = i18next.t(
									"网络异常，请检查网络后，重新进入课堂 ({{arg_0}})",
									{ arg_0: err.response.status }
								);
								switch (err.response.status) {
									case 400:
										msg = i18next.t(
											"请求信息异常，请尝试重新进入课堂，或者联系客服协助解决"
										);
										break;
									case 401:
									case 403:
										msg = i18next.t(
											"鉴权信息异常，请尝试重新进入课堂，或者联系客服协助解决"
										);
										break;
									case 500:
										msg = i18next.t(
											"后台服务正在维护当中，请稍候重新进入课堂，或者联系客服了解进展"
										);
										break;
									default:
								}
								reject(
									new THttpResponse(
										err.response.status,
										err.response.headers,
										msg
									)
								);
							} else {
								if (err.request) {
									// 完成了请求，但未收到响应
									reject(
										new THttpResponse(
											-1,
											{},
											i18next.t("网络异常，请检查网络后，重新进入课堂")
										)
									);
								} else {
									// 请求发送出错
									reject(
										new THttpResponse(
											-2,
											{},
											i18next.t("网络异常，请检查网络后，重新进入课堂")
										)
									);
								}
							}
							console.error(errorInfo, JSON.stringify(err));
						}
					);
			};
			applyRequest();
		});
	}
}
```
