// components/ChatFooter/ChatFooter.js
import styles from './ChatFooter.module.scss';

const ChatFooter = ({ onPublish, isEditable}) => {
  const handlePublish = () => {
    onPublish();
  };

  return (
    <div className={styles.chatFooter}>
      { isEditable &&
      <button onClick={handlePublish}>Publish</button> 
      }
    </div>
  );
};

export default ChatFooter;
