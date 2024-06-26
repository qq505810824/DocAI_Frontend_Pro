import { Tooltip } from '@mui/joy';
import _ from 'lodash';

export default function MyTreeView({ tree, documents, objectDocuments }: any) {
    const MenuItem = ({ item, level, last, last_last }: any) => {
        const paddingLeft = level <= 2 ? 0 : (level - 1) * 0; // 根据层级计算缩进值
        if (item.children) {
            return (
                <li className={'menuItem mb-2'} style={{ paddingLeft }}>
                    {!last_last &&
                        level >= 3 &&
                        _.times(level - 2, function (index) {
                            return (
                                <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl">
                                    |&nbsp;
                                </span>
                            );
                        })}
                    {!last && level !== 1 && (
                        <>
                            <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl">
                                ├─
                            </span>
                        </>
                    )}
                    {last && (
                        <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl">
                            └─
                        </span>
                    )}
                    <a className=" font-bold">{item.subtree_title}</a>

                    <ul className={'submenu'}>
                        {item.children.map((child: any, index: number) => (
                            <MenuItem
                                key={index}
                                item={child}
                                level={level + 1}
                                last={item.children.length - 1 == index}
                                last_last={last}
                            />
                        ))}
                    </ul>
                </li>
            );
        }

        const document = objectDocuments && item?.id && objectDocuments[item?.id];
        return (
            <li
                className={'menu whitespace-nowrap text-ellipsis overflow-hidden'}
                style={{ paddingLeft }}
            >
                {!last_last && last_last != undefined ? (
                    <>
                        {level >= 3 &&
                            _.times(level - 2, function (index) {
                                return (
                                    <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl">
                                        |&nbsp;
                                    </span>
                                );
                            })}
                    </>
                ) : last_last != undefined ? (
                    <>
                        {level >= 3 &&
                            _.times(level - 2, function (index) {
                                return (
                                    <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl">
                                        &nbsp;&nbsp;
                                    </span>
                                );
                            })}
                    </>
                ) : (
                    <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl"></span>
                )}

                {last ? (
                    <>
                        <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl">
                            └─
                        </span>
                    </>
                ) : (
                    <>
                        <span className="font-mono font-bold text-neutral-200 leading-[1.1] text-xl">
                            ├─
                        </span>
                    </>
                )}
                <Tooltip title={document?.name} variant="solid">
                    <a className=" cursor-pointer hover:underline"> {document?.name}</a>
                </Tooltip>
            </li>
        );
    };

    return (
        <ul className={'menu  font-normal  w-full '}>
            {tree.map((item: any, index: number) => (
                <MenuItem key={index} item={item} level={1} />
            ))}
        </ul>
    );
}
