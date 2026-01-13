import { HttpErrorResponse } from "@angular/common/http";

export const httpErrorFormatter = (err: HttpErrorResponse | string | Object) => {
    if (err instanceof HttpErrorResponse) {
        if (err.status == 404) return `接口【${err.url}】不存在！（HTTP状态码：${err.status}）`;
        if (err.status == 500) return `接口【${err.url}】异常，可能为提交数据异常或者服务端内部异常！（HTTP状态码：${err.status}）`;
        if (err.status == 401) return `调用接口【${err.url}】出现身份认证异常，请退出重新登录！（HTTP状态码：${err.status}）`;
        if (err.status == 0) return `调用接口【${err.url}】失败，可能为网络异常或服务端程序未启动！（HTTP状态码：${err.status}）`;
        return `调用接口【${err.url}】失败！相关提示信息：${err.statusText}（HTTP状态码：${err.status}）`;
    } else if (err instanceof Error) {
        return err.message;
    }
    return typeof err == "string" ? err : JSON.stringify(err);
}