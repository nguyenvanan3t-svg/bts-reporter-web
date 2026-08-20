type StationInformationProps = {

    code: string;

    project: string;

    province: string;

    status: string;

    projectCode?: string;

    address?: string;

    excelSource?: string | null;

    createdAt?: string;

    updatedAt?: string;

};

export default function StationInformation({

    code,

    project,

    projectCode,

    province,

    address,

    excelSource,

    status,

    createdAt,

    updatedAt,

}: StationInformationProps) {

    return (

        <div>

            <div
                style={{
                    margin: "-16px -16px 16px -16px",
                    padding: "14px 16px",
                    background: "#1E3A8A",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: 16,
                }}
            >
                Station Information
            </div>

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
                            Excel Source
                        </td>

                        <td>
                            {excelSource ?? "-"}
                        </td>
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
                                    display: "inline-block",
                                    padding: "4px 10px",
                                    borderRadius: 999,
                                    background:
                                        status === "COMPLETED"
                                            ? "#DCFCE7"
                                            : "#FEF3C7",
                                    color:
                                        status === "COMPLETED"
                                            ? "#15803D"
                                            : "#92400E",
                                    fontSize: 12,
                                    fontWeight: 600,
                                }}
                            >
                                {status === "COMPLETED"
                                    ? "Complete"
                                    : "Pending"}
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