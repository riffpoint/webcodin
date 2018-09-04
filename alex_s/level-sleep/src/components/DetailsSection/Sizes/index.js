import React from "react";

const Sizes = ({ sizes = [] }) => (
    <table>
        <tbody>
            {sizes.map(({ id, title, size }) => {
                return (
                    <tr key={id}>
                        <td>{title}</td><td dangerouslySetInnerHTML={{ __html: size }}></td>
                    </tr>
                );
            })}
        </tbody>
    </table>
);

export default Sizes;