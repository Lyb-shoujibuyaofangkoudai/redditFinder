// interface RequestConfig extends RequestInit {
//   baseURL?: string;
//   timeout?: number;
//   params?: Record<string, any>;
//   data?: any;
//   // 新增：指定请求体格式
//   dataType?: 'json' | 'form' | 'urlencoded' | 'auto';
// }
//
// interface ApiResponse<T = any> {
//   data: T;
//   message?: string;
//   code?: number;
//   success?: boolean;
// }
//
// class RequestClient {
//   private baseURL: string;
//   private timeout: number;
//
//   constructor(config: RequestConfig = {}) {
//     this.baseURL = config.baseURL || '';
//     this.timeout = config.timeout || 10000;
//   }
//
//   private buildURL(url: string, params?: Record<string, any>): string {
//     const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;
//
//     if (!params || Object.keys(params).length === 0) {
//       return fullURL;
//     }
//
//     try {
//       const urlObj = new URL(fullURL);
//       Object.keys(params).forEach(key => {
//         if (params[key] !== undefined && params[key] !== null) {
//           urlObj.searchParams.append(key, String(params[key]));
//         }
//       });
//       return urlObj.toString();
//     } catch (error) {
//       console.error('Error building URL:', error);
//       return fullURL;
//     }
//   }
//
//   private processRequestData(data: any, dataType: string = 'auto'): { body: string | FormData | null, headers: Record<string, string> } {
//     const headers: Record<string, string> = {};
//
//     if (!data) {
//       return { body: null, headers };
//     }
//
//     // 如果已经是 FormData 或 URLSearchParams，直接使用
//     if (data instanceof FormData) {
//       return { body: data, headers }; // FormData 不需要设置 Content-Type
//     }
//
//     if (data instanceof URLSearchParams) {
//       headers['Content-Type'] = 'application/x-www-form-urlencoded';
//       return { body: data.toString(), headers };
//     }
//
//     // 如果是字符串，直接使用
//     if (typeof data === 'string') {
//       return { body: data, headers };
//     }
//
//     // 处理对象数据
//     if (typeof data === 'object') {
//       switch (dataType) {
//         case 'json':
//           headers['Content-Type'] = 'application/json';
//           return { body: JSON.stringify(data), headers };
//
//         case 'form':
//           const formData = new FormData();
//           Object.keys(data).forEach(key => {
//             const value = data[key];
//             if (value !== undefined && value !== null) {
//               // 处理文件对象
//               if (value instanceof File || value instanceof Blob) {
//                 formData.append(key, value);
//               } else if (Array.isArray(value)) {
//                 // 处理数组
//                 value.forEach((item, index) => {
//                   formData.append(`${key}[${index}]`, String(item));
//                 });
//               } else if (typeof value === 'object') {
//                 // 处理嵌套对象
//                 formData.append(key, JSON.stringify(value));
//               } else {
//                 formData.append(key, String(value));
//               }
//             }
//           });
//           return { body: formData, headers };
//
//         case 'urlencoded':
//           headers['Content-Type'] = 'application/x-www-form-urlencoded';
//           const urlParams = new URLSearchParams();
//           Object.keys(data).forEach(key => {
//             const value = data[key];
//             if (value !== undefined && value !== null) {
//               if (Array.isArray(value)) {
//                 value.forEach(item => urlParams.append(key, String(item)));
//               } else if (typeof value === 'object') {
//                 urlParams.append(key, JSON.stringify(value));
//               } else {
//                 urlParams.append(key, String(value));
//               }
//             }
//           });
//           return { body: urlParams.toString(), headers };
//
//         case 'auto':
//         default:
//           // 自动检测：如果包含文件，使用 FormData，否则使用 URLSearchParams
//           const hasFile = Object.values(data).some(value =>
//             value instanceof File || value instanceof Blob
//           );
//
//           if (hasFile) {
//             return this.processRequestData(data, 'form');
//           } else {
//             return this.processRequestData(data, 'urlencoded');
//           }
//       }
//     }
//
//     return { body: String(data), headers };
//   }
//
//   private createTimeoutPromise(timeout: number): Promise<never> {
//     return new Promise((_, reject) => {
//       setTimeout(() => {
//         reject(new Error(`Request timeout after ${timeout}ms`));
//       }, timeout);
//     });
//   }
//
//   async request<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//
//     try {
//       // 构建 URL
//       const requestURL = this.buildURL(url, config.params);
//
//       // 处理请求数据
//       const { body, headers: dataHeaders } = this.processRequestData(config.data, config.dataType);
//
//       // 合并 headers
//       const headers = {
//         ...dataHeaders,
//         ...(config.headers as Record<string, string> || {})
//       };
//
//
//       // 构建 fetch 配置
//       const fetchConfig: RequestInit = {
//         method: config.method || 'GET',
//         headers,
//         body,
//         credentials: config.credentials,
//         mode: config.mode,
//         cache: config.cache,
//         redirect: config.redirect,
//         referrer: config.referrer,
//         referrerPolicy: config.referrerPolicy,
//         integrity: config.integrity,
//         keepalive: config.keepalive,
//         signal: config.signal,
//       };
//
//       // 发起请求
//       const response = await Promise.race([
//         fetch(requestURL, fetchConfig),
//         this.createTimeoutPromise(config.timeout || this.timeout)
//       ]);
//
//
//       // 检查响应状态
//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Error response:', errorText);
//         throw new Error(`HTTP ${response.status}: ${errorText}`);
//       }
//
//       // 解析响应
//       const contentType = response.headers.get('content-type') || '';
//       let data: any;
//
//       if (contentType.includes('application/json')) {
//         data = await response.json();
//       } else {
//         data = await response.text();
//       }
//
//       console.log('Response data:', data);
//       console.log('=== REQUEST END ===');
//
//       return data;
//
//     } catch (error) {
//       console.error('Request error:', error);
//       throw error;
//     }
//   }
//
//   // GET 请求
//   get<T = any>(url: string, params?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       ...config,
//       method: 'GET',
//       params,
//     });
//   }
//
//   // POST 请求 - 默认使用 auto 模式（会选择 urlencoded）
//   post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       dataType: 'auto', // 或者直接设置为 'urlencoded'
//       ...config,
//       method: 'POST',
//       data,
//     });
//   }
//
//   // POST JSON - 明确指定使用 JSON 格式
//   postJSON<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       ...config,
//       method: 'POST',
//       data,
//       dataType: 'json',
//     });
//   }
//
//   // POST Form - 明确指定使用 FormData 格式
//   postForm<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       ...config,
//       method: 'POST',
//       data,
//       dataType: 'form',
//     });
//   }
//
//   // PUT 请求
//   put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       dataType: 'auto',
//       ...config,
//       method: 'PUT',
//       data,
//     });
//   }
//
//   // DELETE 请求
//   delete<T = any>(url: string, params?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       ...config,
//       method: 'DELETE',
//       params,
//     });
//   }
//
//   // PATCH 请求
//   patch<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
//     return this.request<T>(url, {
//       dataType: 'auto',
//       ...config,
//       method: 'PATCH',
//       data,
//     });
//   }
// }
//
// // 创建实例
// const request = new RequestClient({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
//   timeout: 10000,
// });
//
// export default request;
// export { RequestClient };
// export type { RequestConfig, ApiResponse };


interface RequestConfig extends RequestInit {
  baseURL?: string;
  timeout?: number;
  params?: Record<string, any>;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  code?: number;
  success?: boolean;
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
type ErrorInterceptor = (error: any) => any;

class RequestClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(config: RequestConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 1000 * 60 * 10;
  }

  // 请求拦截器
  interceptors = {
    request: {
      use: (onFulfilled?: RequestInterceptor, onRejected?: ErrorInterceptor) => {
        if (onFulfilled) this.requestInterceptors.push(onFulfilled);
        if (onRejected) this.errorInterceptors.push(onRejected);
      }
    },
    response: {
      use: (onFulfilled?: ResponseInterceptor, onRejected?: ErrorInterceptor) => {
        if (onFulfilled) this.responseInterceptors.push(onFulfilled);
        if (onRejected) this.errorInterceptors.push(onRejected);
      }
    }
  };

  private buildURL(url: string, params?: Record<string, any>): string {
    const fullURL = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    if (!params || Object.keys(params).length === 0) {
      return fullURL;
    }

    try {
      const urlObj = new URL(fullURL);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          urlObj.searchParams.append(key, String(params[key]));
        }
      });
      return urlObj.toString();
    } catch (error) {
      console.error('Error building URL:', error);
      return fullURL;
    }
  }

  // 自动识别请求体格式
  private processRequestBody(data: any): { body: string | FormData | null, headers: Record<string, string> } {
    const headers: Record<string, string> = {};

    if (!data || data === null || data === undefined) {
      return { body: null, headers };
    }

    // 1. 如果已经是 FormData，直接使用（文件上传场景）
    if (data instanceof FormData) {
      return { body: data, headers }; // 不设置 Content-Type，让浏览器自动设置
    }

    // 2. 如果已经是 URLSearchParams，使用 URL 编码格式
    if (data instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
      return { body: data.toString(), headers };
    }

    // 3. 如果是字符串，直接使用
    if (typeof data === 'string') {
      return { body: data, headers };
    }

    // 4. 如果是对象，自动判断使用什么格式
    if (typeof data === 'object') {
      // 检查是否包含文件对象
      const hasFile = this.hasFileInObject(data);

      if (hasFile) {
        // 包含文件，使用 FormData
        const formData = new FormData();
        this.appendToFormData(formData, data);
        return { body: formData, headers };
      } else {
        // 不包含文件，使用 JSON 格式
        headers['Content-Type'] = 'application/json';
        return { body: JSON.stringify(data), headers };
      }
    }

    // 5. 其他情况转为字符串
    return { body: String(data), headers };
  }

  // 检查对象中是否包含文件
  private hasFileInObject(obj: any): boolean {
    if (!obj || typeof obj !== 'object') return false;

    for (const key in obj) {
      const value = obj[key];
      if (value instanceof File || value instanceof Blob) {
        return true;
      }
      if (Array.isArray(value)) {
        if (value.some(item => item instanceof File || item instanceof Blob)) {
          return true;
        }
      }
      if (value && typeof value === 'object' && this.hasFileInObject(value)) {
        return true;
      }
    }

    return false;
  }

  // 将对象数据添加到 FormData
  private appendToFormData(formData: FormData, obj: any, parentKey: string = ''): void {
    for (const key in obj) {
      const value = obj[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value === null || value === undefined) {
        continue;
      }

      if (value instanceof File || value instanceof Blob) {
        formData.append(formKey, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File || item instanceof Blob) {
            formData.append(`${formKey}[${index}]`, item);
          } else {
            formData.append(`${formKey}[${index}]`, String(item));
          }
        });
      } else if (typeof value === 'object') {
        // 对于嵌套对象，递归处理或转为 JSON 字符串
        formData.append(formKey, JSON.stringify(value));
      } else {
        formData.append(formKey, String(value));
      }
    }
  }

  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = { ...config };

    for (const interceptor of this.requestInterceptors) {
      try {
        processedConfig = await interceptor(processedConfig);
      } catch (error) {
        throw error;
      }
    }

    return processedConfig;
  }

  private async applyResponseInterceptors(response: Response): Promise<Response> {
    let processedResponse = response;

    for (const interceptor of this.responseInterceptors) {
      try {
        processedResponse = await interceptor(processedResponse);
      } catch (error) {
        throw error;
      }
    }

    return processedResponse;
  }

  private handleError(error: any): never {
    for (const interceptor of this.errorInterceptors) {
      try {
        error = interceptor(error);
      } catch (e) {
        error = e;
      }
    }

    if (error instanceof Error) {
      throw error;
    } else if (typeof error === 'string') {
      throw new Error(error);
    } else {
      throw new Error('Unknown error occurred');
    }
  }

  // 核心请求方法
  async request<T = any>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    try {
      // 应用请求拦截器
      const processedConfig = await this.applyRequestInterceptors(config);

      // 构建 URL
      const requestURL = this.buildURL(url, processedConfig.params);

      // 处理请求体
      const { body, headers: bodyHeaders } = this.processRequestBody(processedConfig.body);

      // 合并 headers
      const headers = {
        ...bodyHeaders,
        ...(processedConfig.headers as Record<string, string> || {})
      };

      // 构建 fetch 配置
      const fetchConfig: RequestInit = {
        method: processedConfig.method || 'GET',
        headers,
        body,
        credentials: processedConfig.credentials,
        mode: processedConfig.mode,
        cache: processedConfig.cache,
        redirect: processedConfig.redirect,
        referrer: processedConfig.referrer,
        referrerPolicy: processedConfig.referrerPolicy,
        integrity: processedConfig.integrity,
        keepalive: processedConfig.keepalive,
        signal: processedConfig.signal,
      };

      console.log('Request:', {
        url: requestURL,
        method: fetchConfig.method,
        headers: fetchConfig.headers,
        bodyType: typeof fetchConfig.body,
        bodyContent: fetchConfig.body instanceof FormData ? 'FormData' : fetchConfig.body
      });

      // 发起请求
      const response = await Promise.race([
        fetch(requestURL, fetchConfig),
        this.createTimeoutPromise(processedConfig.timeout || this.timeout)
      ]);

      // 应用响应拦截器
      const processedResponse = await this.applyResponseInterceptors(response);

      // 检查响应状态
      if (!processedResponse.ok) {
        const errorText = await processedResponse.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${processedResponse.status}: ${errorText}`);
      }

      // 解析响应
      const contentType = processedResponse.headers.get('content-type') || '';
      let data: any;

      if (contentType.includes('application/json')) {
        data = await processedResponse.json();
      } else {
        data = await processedResponse.text();
      }

      return data;

    } catch (error) {
      this.handleError(error);
    }
  }

  // GET 请求
  get<T = any>(url: string, params?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'GET',
      params,
    });
  }

  // POST 请求 - 自动识别请求体格式
  post<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: data,
    });
  }

  // PUT 请求
  put<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: data,
    });
  }

  // DELETE 请求
  delete<T = any>(url: string, params?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'DELETE',
      params,
    });
  }

  // PATCH 请求
  patch<T = any>(url: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: data,
    });
  }
}

// 创建默认实例
const request = new RequestClient({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  timeout: 1000 * 10 * 60,
});

// 添加默认拦截器
request.interceptors.request.use(
  (config) => {
    console.log('Request interceptor:', {
      method: config.method,
      url: config.body ? 'has body' : 'no body',
      params: config.params
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    console.log('Response interceptor:', response.status);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);

    if (error.message.includes('401')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.message.includes('403')) {
      console.error('Access forbidden');
    } else if (error.message.includes('500')) {
      console.error('Server error');
    }

    return Promise.reject(error);
  }
);

export default request;
export { RequestClient };
export type { RequestConfig, ApiResponse };
