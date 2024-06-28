import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect, type PropsWithChildren } from 'react';
import { describe, expect, it } from 'vitest';
import { OverlayProvider } from './context/provider';
import { overlay } from './event';

describe('overlay 객체는', () => {
  it('overlay.open을 통해 overlay를 그릴 수 있어야 한다.', () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent = 'context-modal-test-content';
    const Component = () => {
      useEffect(() => {
        overlay.open(() => {
          return <p>{testContent}</p>;
        });
      }, []);

      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });
    expect(screen.queryByText(testContent)).toBeInTheDocument();
  });

  it('overlay.unmount를 통해 열려있는 overlay를 닫을 수 있어야 한다.', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent = 'context-modal-test-content';
    const Component = () => {
      useEffect(() => {
        overlay.open(({ overlayId }) => {
          return (
            <p
              onClick={() => {
                overlay.unmount(overlayId);
              }}
            >
              {testContent}
            </p>
          );
        });
      }, []);

      return <div>Empty</div>;
    };

    const renderComponent = render(<Component />, { wrapper });

    const testContentElement = await renderComponent.findByText(testContent);
    act(() => {
      testContentElement.click();
    });

    expect(screen.queryByText(testContent)).not.toBeInTheDocument();
  });

  it('overlay.unmountAll을 통해 열려있는 모든 overlay를 언마운트할 수 있어야 한다.', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent1 = 'context-modal-test-content-1';
    const testContent2 = 'context-modal-test-content-2';
    const testContent3 = 'context-modal-test-content-3';
    const testContent4 = 'context-modal-test-content-4';

    const Component = () => {
      useEffect(() => {
        overlay.open(() => {
          return <p>{testContent1}</p>;
        });
        overlay.open(() => {
          return <p>{testContent2}</p>;
        });
        overlay.open(() => {
          return <p>{testContent3}</p>;
        });
        overlay.open(() => {
          return <p>{testContent4}</p>;
        });
      }, []);

      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });

    act(() => {
      overlay.unmountAll();
    });

    await waitFor(() => {
      expect(screen.queryByText(testContent1)).not.toBeInTheDocument();
      expect(screen.queryByText(testContent2)).not.toBeInTheDocument();
      expect(screen.queryByText(testContent3)).not.toBeInTheDocument();
      expect(screen.queryByText(testContent4)).not.toBeInTheDocument();
    });
  });

  it('overlay.open을 통해 여러 개의 overlay를 열 수 있어야 한다', async () => {
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent1 = 'context-modal-test-content-1';
    const testContent2 = 'context-modal-test-content-2';
    const testContent3 = 'context-modal-test-content-3';
    const testContent4 = 'context-modal-test-content-4';

    const Component = () => {
      useEffect(() => {
        overlay.open(() => {
          return <p>{testContent1}</p>;
        });
        overlay.open(() => {
          return <p>{testContent2}</p>;
        });
        overlay.open(() => {
          return <p>{testContent3}</p>;
        });
        overlay.open(() => {
          return <p>{testContent4}</p>;
        });
      }, []);

      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });
    expect(screen.queryByText(testContent1)).toBeInTheDocument();
    expect(screen.queryByText(testContent2)).toBeInTheDocument();
    expect(screen.queryByText(testContent3)).toBeInTheDocument();
    expect(screen.queryByText(testContent4)).toBeInTheDocument();
  });

  it('close를 통해 isOpen을 false로 만들어야한다.', async () => {
    let isOpen = false;
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent = 'context-modal-test-content';
    const Component = () => {
      useEffect(() => {
        overlay.open(({ isOpen: _isOpen, close }) => {
          isOpen = _isOpen;
          return (
            <p
              onClick={() => {
                close();
              }}
            >
              {testContent}
            </p>
          );
        });
      });
      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });

    await waitFor(() => {
      expect(isOpen).toBe(true);
    });

    const testContentElement = await screen.findByText(testContent);
    act(() => {
      testContentElement.click();
    });

    expect(isOpen).toBe(false);
  });

  it('overlay.closeAll을 톨해 모든 overlay의 isOpen을 false로 만들어야 한다.', async () => {
    const isOpen = [false, false, false, false];
    const wrapper = ({ children }: PropsWithChildren) => <OverlayProvider>{children}</OverlayProvider>;

    const testContent1 = 'context-modal-test-content-1';
    const testContent2 = 'context-modal-test-content-2';
    const testContent3 = 'context-modal-test-content-3';
    const testContent4 = 'context-modal-test-content-4';

    const Component = () => {
      useEffect(() => {
        overlay.open(({ isOpen: _isOpen }) => {
          isOpen[0] = _isOpen;
          return <p>{testContent1}</p>;
        });
        overlay.open(({ isOpen: _isOpen }) => {
          isOpen[1] = _isOpen;
          return <p>{testContent2}</p>;
        });
        overlay.open(({ isOpen: _isOpen }) => {
          isOpen[2] = _isOpen;
          return <p>{testContent3}</p>;
        });
        overlay.open(({ isOpen: _isOpen }) => {
          isOpen[3] = _isOpen;
          return <p>{testContent4}</p>;
        });
      }, []);

      return <div>Empty</div>;
    };

    render(<Component />, { wrapper });

    await waitFor(() => {
      expect(isOpen).toEqual([true, true, true, true]);
    });

    act(() => {
      overlay.closeAll();
    });

    await waitFor(() => {
      expect(isOpen).toEqual([false, false, false, false]);
    });
  });
});
