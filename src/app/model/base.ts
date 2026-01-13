export type RhSafeAny = any;

// export function enumerable(value: false) {
//   return function (target: RhSafeAny, propertyKey: string) {
//   };
// }

/** 选择项模型 */
export class RhSelectableDto {
  public check? = false;
  public select? = false;
  public expand?: boolean;
  public disabled?: boolean;
  [prop: string]: RhSafeAny;
}

export class RhSelectItem extends RhSelectableDto {
  constructor(
    /** 文本 */
    public Text: string,
    /** 值 */
    public Value: string | number | boolean | null,
    public IsEnable?: boolean
  ) {
    super();
  }
}

export class RhSelectItemT<T extends string> extends RhSelectableDto {
  constructor(
    /** 文本 */
    public Text: string,
    /** 值 */
    public Value: T
  ) {
    super();
  }
}

/** 时间戳类型，一般使用`Date.getTime()作为时间戳` */
export type RhTimeStamp = {
  /** 创建时间戳 */
  __timestamp: number;
};
/** 更新时间，记录节点的更新时间 */
export type RhUpdateTime = {
  /** 更新时间，一般使用当前时间并格式化的值 */
  updateTime: string;
  /** 创建时间，一旦初始化后就无法更改 */
  createTime?: string;
};

/** 兼容`null`和`undefined`的泛型类型 */
export type WithNil<T> = T | null | undefined;

// 操作结果
export class OpResult {
  constructor(
    public Message: string, // 结果信息

    public Success: boolean, // 结果标志

    public Record: number, // 记录数

    public Attach: Object // 万能传值对象
  ) {}
}

// 操作结果泛型
export class OpResultT<T> {
  constructor(
    public Message: string, // 结果信息

    public Success: boolean, // 结果标志

    public Record: number, // 记录数

    public Attach: T // 万能传值对象
  ) {}

  static create() {
    return new OpResultT('success', true, 1, {});
  }
}

/**
 * http状态码，拷贝至`@nestjs/common`
 */
export enum RhHttpStatus {
  CONTINUE = 100,
  SWITCHING_PROTOCOLS = 101,
  PROCESSING = 102,
  EARLYHINTS = 103,
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NON_AUTHORITATIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  CONTENT_DIFFERENT = 210,
  AMBIGUOUS = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FAILED = 412,
  PAYLOAD_TOO_LARGE = 413,
  URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIABLE = 416,
  EXPECTATION_FAILED = 417,
  I_AM_A_TEAPOT = 418,
  MISDIRECTED = 421,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  PRECONDITION_REQUIRED = 428,
  TOO_MANY_REQUESTS = 429,
  //#region 自定义状态码
  /** 字段名拼写错误 */
  UNKNOWN_ARG_MATCH_ERROR = 432,
  /** 字段类型不匹配错误 */
  TYPE_MISMATCH_MATCH_ERROR = 433,
  /** 必填字段错误 */
  MISSING_ARG_MATCH_ERROR = 434,
  /** 复合唯一约束错误 */
  UNIQUE_CONSTRAINT_MATCH_ERROR = 435,
  /** 重复数据错误 */
  DUPLICATE_MATCH_ERROR = 436,
  /** 存在关联数据错误 */
  EXIST_RELATION_MATCH_ERROR = 437,
  /** 操作数据不存在错误 */
  NOT_EXIST_MATCH_ERROR = 438,
  /** 超出长度限制错误 */
  LENGTH_LIMIT_MATCH_ERROR = 439,
  /** 未找到符合条件的数据 */
  NOT_FOUND_MATCH_ERROR = 440,
  /** 查询条件错误 */
  QUERY_ARG_MATCH_ERROR = 441,
  //#endregion
  UNRECOVERABLE_ERROR = 456,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  INSUFFICIENT_STORAGE = 507,
  LOOP_DETECTED = 508,
}

export class DataResultT<T = RhSafeAny> {
  /** 原始响应[可选]，可以将后端返回的原始数据返回 */
  origin?: RhSafeAny;
  /** 请求选项，用于连接form和对应的table */
  //requestOption?: RhDataResultRequestOption;
  constructor(
    public statusCode: RhHttpStatus,
    public Success: boolean,
    public Message: string,
    public Attach: T,
    public record?: number,
    public totalCount?: number,
    public pageIndex?: number,
    public pageSize?: number
  ) {}

  public success: boolean;
  public message: string;
  public attach: T;

  static create<T>(
    statusCode: RhHttpStatus,
    success: boolean,
    message: string,
    attach: T,
    record?: number,
    totalCount?: number,
    pageIndex?: number,
    pageSize?: number
  ): DataResultT<T> {
    return new DataResultT(
      statusCode,
      success,
      message,
      attach,
      record,
      totalCount,
      pageIndex,
      pageSize
    );
  }
  static success<T>(message: string, attach: T): DataResultT<RhSafeAny> {
    return new DataResultT(RhHttpStatus.OK, true, message, attach, 0, 0);
  }
  static fail(
    statusCode = RhHttpStatus.OK,
    message?: string
  ): DataResultT<RhSafeAny> {
    return new DataResultT(statusCode, false, message || '', 0, 0, 0);
  }
}

/**
 * 通用查询模型（pageSize/pageIndex）
 */
export interface RhQueryDto {
  isPaged?: boolean;
  /** 分页大小 */
  pageSize?: number;
  /** 页码,从1开始 */
  pageIndex?: number;
  where?: Record<string, RhSafeAny>;
  select?: RhSafeAny;
  orderBy?: {
    [prop: string]: 'asc' | 'desc';
  }[];
  /** 创建人 */
  create_by?: string;
  [prop: string]: RhSafeAny;
}
