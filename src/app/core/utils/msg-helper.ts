import { NzNotificationDataOptions } from 'ng-zorro-antd/notification';
import { I18nHelper } from './i18n-helper';
import { RH_INTERACT_CONFIG } from '../logger';

/** loading默认持续时间设置为`3000`ms
 * @description 设置为`0`时为不主动消失
 */
const DURATION_TIME = 3000;

/**
 * 消息助手
 * @description 消息api的二次封装，解除组件与`NzModalService`和`NzMessageService`的耦合
 */
export class MsgHelper {
  // static isLogOn = JSON.parse(window.localStorage.getItem('APP_CONFIG')).isLogOn;

  //#region *********对话框提示区域*****************************************

  /**
   * 显示成功消息的模态窗口
   * @param msg 消息
   */
  public static ShowSuccessModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.successModal) {
      RH_INTERACT_CONFIG.successModal(I18nHelper.translate(msg));
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG successModal ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示错误消息的模态窗口
   * @param msg 消息
   */
  public static ShowErrorModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.errorModal) {
      RH_INTERACT_CONFIG.errorModal(I18nHelper.translate(msg));
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG errorModal ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示常规消息的模态窗口
   * @param msg 消息
   */
  public static ShowInfoModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.logModal) {
      RH_INTERACT_CONFIG.logModal(I18nHelper.translate(msg));
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG logModal ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示警告消息的模态窗口
   * @param msg 消息
   */
  public static ShowWarningModal(msg: string): void {
    if (RH_INTERACT_CONFIG?.warnModal) {
      RH_INTERACT_CONFIG.warnModal(I18nHelper.translate(msg));
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG warnModal ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示确认模态窗口
   * @param title 标题
   * @param content 内容
   * @param okFun 点击确定后的回调函数
   */
  public static ShowConfirmModal(
    title: string,
    content: string,
    okFun: () => void | Promise<void | boolean>,
    cancelFn?: () => void,
    okType: 'primary' | 'danger' = 'primary',
    okText = 'Common.General.confirm',
    cancelText = 'Common.General.cancel'
  ) {
    if (RH_INTERACT_CONFIG?.confirm) {
      RH_INTERACT_CONFIG.confirm({
        title: `<i>${I18nHelper.translate(title)}</i>`,
        msg: `<b>${I18nHelper.translate(content)}</b>`,
        onOk: () => {
          okFun();
        },
        onCancel: () => {
          if (cancelFn) {
            cancelFn();
          }
        },
        okType: okType,
        okText: I18nHelper.translate(okText),
        cancelText: I18nHelper.translate(cancelText),
      });
    } else {
      this.ConsoleErrorMessage(
        `RH_INTERACT_CONFIG confirm ` + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 根据传入的判定条件，为true时显示二次确认弹窗，为false时直接执行ok回调函数
   * @param predicate 判断条件
   * @param title 标题
   * @param content 内容
   * @param okFun 点击确认后的回调
   * @param cancelFn 点击取消后的回调
   * @param okType 确认按钮类型
   * @param okText 确认按钮文本
   * @param cancelText 取消按钮文本
   */
  public static ShowConditionalConfirmModal(
    predicate: (() => boolean) | boolean,
    title: string,
    content: string,
    okFun: () => void | Promise<void | boolean>,
    cancelFn?: () => void,
    okType: 'primary' | 'danger' = 'primary',
    okText = 'Common.General.confirm',
    cancelText = 'Common.General.cancel'
  ) {
    if (typeof predicate === 'function') {
      predicate = predicate();
    }
    if (predicate) {
      this.ShowConfirmModal(title, content, okFun, cancelFn, okType, okText, cancelText);
    } else {
      okFun();
    }
  }

  /**
   * 根据传入参数，提示通用权限不足，还是菜单权限不足
   * @param isGeneralAuth 是否通用权限提示
   */
  public static ShowUnAuthModal(isGeneralAuth = false) {
    // const msg = isGeneralAuth ? 'UI.Control.message.unFunctionTip' : 'UI.Control.message.unAuthTip';
    const msg = 'Common.General.unAuthTip';
    if (RH_INTERACT_CONFIG?.warnModal) {
      RH_INTERACT_CONFIG.warnModal(I18nHelper.translate(msg));
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG warnModal ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示删除询问模态窗口
   * @param content 内容
   * @param okFun 点击确定后的回调
   * @param cancelFun 点击取消后的回调
   */
  public static ShowDeleteConfirm(
    content: string,
    okFun: () => (boolean | void) | Promise<boolean | void>,
    cancelFun?: () => (boolean | void) | Promise<boolean | void>,
    okText = 'Common.General.confirm',
    cancelText = 'Common.General.cancel'
  ) {
    if (RH_INTERACT_CONFIG?.confirm) {
      RH_INTERACT_CONFIG.confirm({
        title: I18nHelper.translate('Control.message.deleteConfirmation'),
        msg: `<b style="color: red;"> ${I18nHelper.translate(content)}</b>`,
        okText: I18nHelper.translate(okText),
        okType: 'danger',
        onOk: () => {
          okFun();
        },
        cancelText: I18nHelper.translate(cancelText),
        onCancel: () => {
          if (cancelFun) {
            cancelFun();
          }
        },
      });
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG confirm ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示询问确认模态窗口
   * @param title 表体
   * @param content 内容
   * @param okFun 点击确定后的回调
   * @param cancelFun 点击取消后的回调
   */
  public static ShowQuestionConfirm(
    title: string,
    content: string,
    okFun: () => (boolean | void) | Promise<boolean | void>,
    cancelFun: () => (boolean | void) | Promise<boolean | void>,
    okText = 'Common.General.confirm',
    cancelText = 'Common.General.cancel'
  ): void {
    if (RH_INTERACT_CONFIG?.confirm) {
      RH_INTERACT_CONFIG.confirm({
        title: I18nHelper.translate(title),
        msg: `<b style="color: red;"> ${I18nHelper.translate(content)}</b>`,
        okText: I18nHelper.translate(okText),
        okType: 'danger',
        onOk: () => {
          okFun();
        },
        cancelText: I18nHelper.translate(cancelText),
        onCancel: () => {
          cancelFun();
        },
      });
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG confirm' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  //#endregion *********对话框提示区域****************************************

  //#region *****消息提示区域区域******************

  /**
   * 显示成功的提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowSuccessMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.successMsg) {
      RH_INTERACT_CONFIG.successMsg(I18nHelper.translate(msg), duration);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG successMsg' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowInfoMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.logMsg) {
      RH_INTERACT_CONFIG.logMsg(I18nHelper.translate(msg), duration);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG logMsg ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示提示信息
   * @param msg 消息
   */
  public static ShowTodoMessage() {
    if (RH_INTERACT_CONFIG?.logMsg) {
      RH_INTERACT_CONFIG.logMsg(I18nHelper.translate('Common.General.underConstruction'));
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG logMsg ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示警告的提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowWarningMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.warnMsg) {
      RH_INTERACT_CONFIG.warnMsg(I18nHelper.translate(msg), duration);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG warnMsg ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示错误的提示信息
   * @param msg 消息
   * @param duration 持续时间，默认为`3000`(3秒);不传入或者传入`0`也是默认值`3000`
   */
  public static ShowErrorMessage(msg: string, duration = 3000) {
    if (RH_INTERACT_CONFIG?.errorMsg) {
      RH_INTERACT_CONFIG.errorMsg(I18nHelper.translate(msg), duration);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG errorMsg' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /**
   * 显示Loading对话框
   * @param msg 展示信息
   * @param duration 持续时间(毫秒),当设置为0时不消失，默认为`3000`毫秒
   */
  static ShowLoadingMessage(msg: string, duration = DURATION_TIME): string {
    if (RH_INTERACT_CONFIG?.loading) {
      return RH_INTERACT_CONFIG.loading(I18nHelper.translate(msg), duration) || '';
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG loading ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
      return '';
    }
  }

  /**
   * 关闭loading框
   * @param id messageId
   */
  static CloseLoadingMessage(id: string) {
    if (RH_INTERACT_CONFIG?.clearLoading) {
      RH_INTERACT_CONFIG.clearLoading(id);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG clearLoading' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  /** 显示全局loading对话框，显示下一个loading对话框会清除上一个对话框
   * @param msg 展示信息
   * @param duration 持续时间(毫秒),当设置为0时不消失，默认为`3000`毫秒
   */
  static ShowGlobalLoadingMessage(msg: string, duration = DURATION_TIME) {
    if (RH_INTERACT_CONFIG.loadingId) {
      RH_INTERACT_CONFIG.clearLoading?.(RH_INTERACT_CONFIG.loadingId);
      RH_INTERACT_CONFIG.loadingId = null;
    }
    // 使用setTimeout防止上一个全局loading没有清理掉
    setTimeout(() => {
      if (RH_INTERACT_CONFIG?.loading) {
        RH_INTERACT_CONFIG.loadingId = RH_INTERACT_CONFIG.loading(I18nHelper.translate(msg), duration);
        if (duration > 0) {
          setTimeout(() => {
            RH_INTERACT_CONFIG.loadingId = null;
          }, duration);
        }
      } else {
        this.ConsoleErrorMessage(
          'RH_INTERACT_CONFIG loading ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
        );
      }
    });
  }
  /**
   *  关闭全局loading对话框
   */
  static CloseGlobalLoadingMessage() {
    if (RH_INTERACT_CONFIG?.clearLoading) {
      if (RH_INTERACT_CONFIG.loadingId) {
        RH_INTERACT_CONFIG.clearLoading();
      }
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG clearLoading ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }
  //#endregion *****消息提示区域区域******************

  //#region notification通知区域
  static ShowInfoNotification(title: string, content: string, options?: NzNotificationDataOptions) {
    if (RH_INTERACT_CONFIG?.logNotification) {
      RH_INTERACT_CONFIG.logNotification(I18nHelper.translate(title), I18nHelper.translate(content), options);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG errorMsg ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }
  static ShowSuccessNotification(title: string, content: string, options?: NzNotificationDataOptions) {
    if (RH_INTERACT_CONFIG?.successNotification) {
      RH_INTERACT_CONFIG.successNotification(I18nHelper.translate(title), I18nHelper.translate(content), options);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG errorMsg ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  static ShowWarnNotification(title: string, content: string, options?: NzNotificationDataOptions) {
    if (RH_INTERACT_CONFIG?.warnNotification) {
      RH_INTERACT_CONFIG.warnNotification(I18nHelper.translate(title), I18nHelper.translate(content), options);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG errorMsg ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }

  static ShowErrorNotification(
    title: string,
    content: string,
    options: NzNotificationDataOptions = {
      nzPlacement: 'bottomRight',
    }
  ) {
    if (RH_INTERACT_CONFIG?.errorNotification) {
      RH_INTERACT_CONFIG.errorNotification(I18nHelper.translate(title), I18nHelper.translate(content), options);
    } else {
      this.ConsoleErrorMessage(
        'RH_INTERACT_CONFIG errorMsg ' + `${I18nHelper.translate('Common.General.notConfigured')}!`
      );
    }
  }
  //#endregion notification通知区域结束

  //#region console区域

  /** 控制台程序 */
  static ConsoleLogMessage(msg: string) {
    console.log(I18nHelper.translate(msg));
  }

  /** 控制台程序 */
  static ConsoleWarnMessage(msg: string) {
    console.warn(I18nHelper.translate(msg));
  }

  static ConsoleErrorMessage(msg: string) {
    console.error(I18nHelper.translate(msg));
  }
  //#endregion console区域结束
}
