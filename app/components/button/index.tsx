import cx from 'classnames';

import styles from './index.module.scss';

type Props = {
    title: string,
    subtitle?: string,
    className?: string,
}
export default function Button({title, subtitle, className}: Props) {
    return (
        <div className={cx(styles.root, className)}>
            <p className={styles.title}>{title}</p>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
    )
}