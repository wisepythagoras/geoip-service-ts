export {};

declare global {
    /**
     * The storage module provides access to the `.store` folder and the files within it.
     */
    namespace storage {
        /**
         * Before accessing the storage, `init()` needs to be called. The best place to run
         * it is within the `install` function.
         * @example
         * function install() {
         *     storage.init();
         *     return { ... };
         * }
         */
        function init(): Promise<void>;
        /**
         * The save function atempts to save `contents` to `fileName`. If it fails the promise
         * is rejected, otherwise it silently resolves.
         * @param fileName The name of the file in the `.store` folder.
         * @param contents The contents to write to the file.
         */
        function save(fileName: string, contents: string): Promise<void>;
        /**
         * Removes a file from the `.store` folder.
         * @param fileName The name of the file in `.store` to remove.
         */
        function remove(fileName: string): Promise<void>;
        /**
         * Attempts to read a file from `.store`.
         * @param fileName The name of the file to read.
         */
        function read(fileName: string): Promise<string>;
    }

    namespace IPList {
        /**
         * Parses a string containing an IP set/list into a string array.
         * @param blob The blob to parse.
         */
        function parse(blob: string): Promise<string[]>;
    }

    class IP {
        ip: string;
        /**
         * This class is used to parse IP addresses and CIDR ranges.
         * @param ip The IP address string to parse.
         */
        constructor(ip: string);
        /**
         * Returns whether the IP address that was parsed is valid or not.
         */
        isValid(): boolean;
        /**
         * Returns whether the parsed string is a CIDR range or not.
         */
        isCIDRRange(): boolean;
        /**
         * Returns whether the parsed string is a loopback address or not.
         */
        isLoopback(): boolean;
        /**
         * Returns whether the parsed string is a private IP or not.
         */
        isPrivate(): boolean;
        /**
         * Returns whether the IP is a global unicast address.
         * The identification of global unicast addresses uses address type
         * identification as defined in RFC 1122, RFC 4632 and RFC 4291 with
         * the exception of IPv4 directed broadcast addresses. It returns
         * true even if ip is in IPv4 private address space or local IPv6
         * unicast address space.
         */
        isGlobalUnicast(): boolean;
        /**
         * Returns whether the IP is an interface-local multicast address.
         */
        isInterfaceLocalMulticast(): boolean;
        /**
         * Returns whether the IP is a link-local multicast address.
         */
        isLinkLocalMulticast(): boolean;
        /**
         * Returns whether the IP is a link-local unicast address
         */
        isLinkLocalUnicast(): boolean;
        /**
         * Returns whether the IP is a multicast address
         */
        isMulticast(): boolean;
        /**
         * Returns whether the IP is an unspecified address, either the IPv4
         * address "0.0.0.0" or the IPv6 address "::".
         */
        isUnspecified(): boolean;
        /**
         * Returns whether the parsed string is unspecified or not.
         */
        isUnspecified(): boolean;
        /**
         * Returns the default IP mask for the IP address. Only IPv4 addresses have
         * default masks; It returns null if the IP is not a valid IPv4 address.
         */
        getMask(): boolean;
        /**
         * If the class was constructed with a CIDR range, then `networkPrefix` is
         * not required, but if it's an IP address, then it is required.
         * @example
         * const ip = new IP('1.1.1.1');
         * ip.getRange(16); // -> 1.1.0.0, 1.1.0.0/16
         * @param networkPrefix The network prefix can be a positive number (0, 6, 12, 16, 24, etc).
         */
        getRange(networkPrefix?: number): RangeDetailsT;
        /**
         * If the parsed address is an IP, this will return `true` if `ip` matches the IP
         * that was parsed. If the parsed address is a CIDR range then it will return
         * `true` if `ip` is within this CIDR range.
         */
        contains(ip: string): boolean;
    }

    /**
     * Access and manage the dedicated database for the extension.
     * @example
     * const db = new DB();
     */
    class DB {
        // querySync(q: string, ...args: any): Record<string, any>[] | null;
        // execSync(sql: string, ...args: any): SQLExecResultT | null;
        /**
         * Run a query.
         * @example
         * const rows = await db.query('select * from stuff where id = ?', myId);
         * @param q The query
         * @param args The arguments
         */
        query(q: string, ...args: any): Promise<Record<string, any>[]>;
        /**
         * Execute queries such as insert, delete, create, etc.
         * @example
         * const res = await db.exec('update stuff set field = ? where id = ?', data, myId);
         * @param sql The query
         * @param args The arguments
         */
        exec(sql: string, ...args: any): Promise<SQLExecResultT>;
    }

    /**
     * The IPSet class parses and manages an IP set.
     * @example
     * const ipSet = new IPSet(['1.1.1.1', '2.2.2.2/16']);
     */
    class IPSet {
        /**
         * Create a new instance of an IP set based on an array of IPs or
         * an actual IP set file.
         * @param set The IP set
         * @param opts Any options
         */
        constructor(set: string[] | string, opts?: Partial<IPSetOptsT>);
        /**
         * Returns the list of IPs and CIDR ranges.
         */
        getEntries(): string[];
        /**
         * Check if the set contains an IP or CIDR range.
         * @param ip The IP or CIDR range
         */
        contains(ip: string): boolean;
        /**
         * Generate the plaintext IP set.
         */
        generate(): string;
    }

    type RequestT = {
        /**
         * Returns the value of the URL param.
         * @example
         * // For endpoint `/my/endpoint/:myparam`
         * const myparam = req.param('myparam');
         * @param name The name of the URL param.
         */
        param: (name: string) => string;
        /**
         * Returns the value of the request header.
         * @param name The name of the header.
         */
        getHeader: (name: string) => string;
        /**
         * Returns the value of the URL query. If the key doesn't exist, then it will return
         * an empty string.
         * @param name The name of the query param.
         */
        getQuery: (name: string) => string;
        /**
         * Returns the requesting client's IP address.
         * @returns The client's IP address.
         */
        clientIP: () => string;
    };

    type ResponseT = {
        /**
         * Responds with JSON.
         * @param status The HTTP status.
         * @param payload The payload to return.
         */
        json: (status: number, payload: any) => void;
        /**
         * Abort the HTTP request.
         * @param status The status to return.
         * @param reason The reason the request is being aborted.
         */
        abort: (status: number, reason: string) => void;
    };
    
    type SQLExecResultT = {
        rowsAffected: number;
    };
    
    type RangeDetailsT = {
        ip: string;
        range: string;
    };

    type HTTPMethodT = 'GET' | 'POST' | 'PUT' | 'DELETE';

    type EndpointT = {
        /**
         * All endpoints are added under the `/api` route, so your definition
         * should omit the `/api` part. These endpoints are specific to each
         * extension.
         * @example
         * `/list` will translate to `/api/my-extension/list`
         */
        endpoint: string;
        method: HTTPMethodT;
        /**
         * This should be the name of the function that you defined to handle the request.
         */
        handler: string;
    };

    type CronJobT = {
        /**
         * The format for this is the same as the crontab on Linix. You can use https://cron.help
         * to craft these.
         */
        cron: string;
        /**
         * This should be the name of the function that you defined to handle the job.
         */
        job: string;
    };

    type ExtensionConfigT = {
        version: number;
        name: string;
        endpoints: EndpointT[];
        jobs: CronJobT[];
        hasLookup?: boolean;
    };

    enum UpdateFreq {
        Hourly = 0,
        Daily = 1,
        Weekly = 2,
        BiWeekly = 3,
        Monthly = 4,
    }

    type IPSetOptsT = {
        name: string;
        maintainer: string;
        url: string;
        date: Date;
        update_req: UpdateFreq;
        version: number;
        description: string;
        notes: string;
    };
}
