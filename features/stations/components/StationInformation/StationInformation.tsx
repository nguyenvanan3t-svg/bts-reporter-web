type StationInformationProps = {

    code: string;

    project: string;

    province: string;

    status: string;

    projectCode?: string;

    address?: string;

    createdAt?: string;

    updatedAt?: string;

};

export default function StationInformation({

    code,

    project,

    projectCode,

    province,

    address,

    status,

    createdAt,

    updatedAt,

}: StationInformationProps) {

    return (

        <div>

            <h3
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                }}
            >
                Station Overview
            </h3>

            <div
                style={{
                    height: 1,
                    background: "#E5E7EB",
                    marginBottom: 18,
                }}
            />

            <table
                style={{
                    width: "100%",
                    borderSpacing: "0 14px",
                }}
            >
                <tbody>

                    <tr>
                        <td
                            style={{
                                width: 90,
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Code
                        </td>

                        <td>{code}</td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Project
                        </td>

                        <td>{project}</td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Project Code
                        </td>

                        <td>{projectCode ?? "-"}</td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Province
                        </td>

                        <td>{province}</td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Address
                        </td>

                        <td>{address ?? "-"}</td>
                    </tr>

                    <tr>

                        <td
                            style={{
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Status
                        </td>

                        <td>

                            <span
                                style={{
                                    padding: "4px 10px",
                                    borderRadius: 999,
                                    background: "#FEF3C7",
                                    color: "#92400E",
                                    fontSize: 12,
                                    fontWeight: 600,
                                }}
                            >
                                {status}
                            </span>

                        </td>

                    </tr>

                    <tr>
                        <td
                            style={{
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Created
                        </td>

                        <td>{createdAt ?? "-"}</td>
                    </tr>

                    <tr>
                        <td
                            style={{
                                fontWeight: 600,
                                color: "#64748b",
                            }}
                        >
                            Updated
                        </td>

                        <td>{updatedAt ?? "-"}</td>
                    </tr>

                </tbody>

            </table>

        </div>

    );

}